function LSystem(axiom, rules){
  this.expansions = [axiom];
  this.rules = rules;
}

LSystem.prototype = {
  _expand: function(n){
    if(n < this.expansions.length)
      return;

    var output = "";
    var expansion = this.expansions[this.expansions.length - 1];

    for(var i = 0; i < expansion.length; i++){
      var subst = this.rules[expansion[i]];
      output += subst ? subst : expansion[i];
    }

    this.expansions[this.expansions.length] = output;
    this._expand(n);
  },

  getExpansion: function(n){
    this._expand(n);
    return this.expansions[n];
  }
}
