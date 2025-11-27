function fixedShareFraction(role, counts, context) {
  if (role === 'wife') return context.childrenExists ? 1/8 : 1/4;
  if (role === 'husband') return context.childrenExists ? 1/4 : 1/2;
  if (role === 'mother') return context.childrenExists ? 1/6 : (context.siblingsExist ? 1/6 : 1/3);
  if (role === 'father') return context.childrenExists ? 0 : 1/6;
  if (role === 'daughter_single') return 1/2;
  if (role === 'daughters_multi') return 2/3;
  return 0;
}

function calcShares(input) {
  const tot = Number(input.estate || 0);
  const debt = Math.min(Number(input.debts || 0), tot);
  let pool = tot - debt;

  let willAmt = 0;
  const willF = Number(input.willFraction || 0);
  if (willF > 0) {
    const cap = input.ignoreWillLimit ? 1 : (1/3);
    const applied = Math.min(willF, cap);
    willAmt = +(pool * applied);
    pool -= willAmt;
  }

  const c = input.counts || {};
  const husband = Number(c.husband||0);
  const wife = Number(c.wife||0);
  const sons = Number(c.sons||0);
  const daughters = Number(c.daughters||0);
  const father = Number(c.father||0);
  const mother = Number(c.mother||0);
  const brothers = Number(c.brothers||0);
  const sisters = Number(c.sisters||0);
  const uncles = Number(c.uncles||0);
  const aunts = Number(c.aunts||0);

  const context = {
    childrenExists: (sons + daughters) > 0,
    siblingsExist: (brothers + sisters) > 0,
    parentsExist: (father + mother) > 0
  };

  const shares = {};
  if (wife>0) shares.wife = +(pool * fixedShareFraction('wife', c, context));
  if (husband>0) shares.husband = +(pool * fixedShareFraction('husband', c, context));
  if (mother>0) shares.mother = +(pool * fixedShareFraction('mother', c, context));
  if (father>0) shares.father = +(pool * fixedShareFraction('father', c, context));

  let fixedSum = Object.values(shares).reduce((s,a)=>s+(Number(a)||0),0);
  let resid = +(pool - fixedSum);

  if ((sons===0) && (daughters>0)) {
    if (daughters===1) {
      const amt = +(resid * fixedShareFraction('daughter_single', c, context));
      shares.daughters = amt;
      resid -= amt;
    } else {
      const amt = +(resid * fixedShareFraction('daughters_multi', c, context));
      shares.daughters = amt;
      resid -= amt;
    }
  }

  if ((sons + daughters) > 0) {
    const units = sons*2 + daughters*1;
    if (units>0) {
      const unitVal = resid / units;
      if (sons>0) shares.sons = +(unitVal*2*sons);
      if (daughters>0) shares.daughters = (shares.daughters||0) + +(unitVal*1*daughters);
      resid = 0;
    }
  } else if (father>0) shares.father = (shares.father||0) + resid;
  else if ((brothers + sisters) > 0) {
    const units = brothers*2 + sisters*1;
    if (units>0) {
      const unitVal = resid / units;
      if (brothers>0) shares.brothers = +(unitVal*2*brothers);
      if (sisters>0) shares.sisters = +(unitVal*1*sisters);
      resid = 0;
    }
  } else if ((uncles + aunts) > 0) {
    const units = uncles*2 + aunts*1;
    if (units>0) {
      const unitVal = resid / units;
      if (uncles>0) shares.uncles = +(unitVal*2*uncles);
      if (aunts>0) shares.aunts = +(unitVal*1*aunts);
      resid = 0;
    }
  }

  const distributed = Object.values(shares).reduce((s,a)=>s+(Number(a)||0),0) + willAmt + debt;
  const undistributed = +(tot - distributed);

  return { input, shares, willAmt, debt, distributed, undistributed };
}

module.exports = { calcShares };
