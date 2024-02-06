var groupAnagrams = function (strs) {
  const result = [];
  const groups = new Map();

  for (const s of strs) {
      const key = [...s].sort().join('');
      if (!groups.has(key)) {
          groups.set(key, []);
      }
      groups.get(key).push(s);
  }

  for (const group of groups.values()) {
      result.push(group);
  }

  return result;
};