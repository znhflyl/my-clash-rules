// Shared rule-provider bridge. Contains no nodes, subscriptions, or credentials.
function main(config) {
  var current = config.rules || [];
  var local = current.filter(function(rule) {
    var fields = rule.split(',');
    return fields[2] === 'DIRECT' || fields[2] === 'REJECT';
  });
  config['rule-providers'] = config['rule-providers'] || {};
  var base = 'https://raw.githubusercontent.com/znhflyl/my-clash-rules/main/';
  ['personal-direct', 'personal-proxy'].forEach(function(name) {
    config['rule-providers'][name] = {
      type: 'http', behavior: 'classical', format: 'yaml',
      url: base + name + '.yaml', path: './ruleset/' + name + '.yaml',
      interval: 3600, proxy: 'PROXY'
    };
  });
  config.rules = local.concat([
    'RULE-SET,personal-direct,DIRECT',
    'RULE-SET,personal-proxy,PROXY',
    'MATCH,DIRECT'
  ]);
  return config;
}
