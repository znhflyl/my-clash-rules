// Shared rule-provider bridge. Contains no nodes, subscriptions, or credentials.
function main(config) {
  var names = ['personal-direct', 'personal-proxy', 'personal-reject', 'apple-developer-proxy'];
  var current = config.rules || [];
  var local = current.filter(function(rule) {
    var fields = rule.split(',');
    if (fields[0] === 'RULE-SET' && names.indexOf(fields[1]) !== -1) return false;
    return fields[2] === 'DIRECT' || fields[2] === 'REJECT';
  });
  config['rule-providers'] = config['rule-providers'] || {};
  var base = 'https://raw.githubusercontent.com/znhflyl/my-clash-rules/main/';
  names.forEach(function(name) {
    config['rule-providers'][name] = {
      type: 'http', behavior: 'classical', format: 'yaml',
      url: base + name + '.yaml', path: './ruleset/' + name + '.yaml',
      interval: 3600, proxy: 'PROXY'
    };
  });
  // Narrow Apple exceptions must precede device-local apple.com DIRECT.
  config.rules = ['RULE-SET,apple-developer-proxy,PROXY'].concat(local, [
    'RULE-SET,personal-direct,DIRECT',
    'RULE-SET,personal-reject,REJECT',
    'RULE-SET,personal-proxy,PROXY',
    'MATCH,DIRECT'
  ]);
  return config;
}
