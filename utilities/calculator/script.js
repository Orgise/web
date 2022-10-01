$(function() {

  var expression = '';
  var expressionArray = [];
  var screenArray = [];
  var parentheses = 0;
  var ansOnScreen = false;
  var ans = null;
  var error = false;
  var inverted = false;

  function defaults() {
    expression = '';
    expressionArray = [];
    screenArray = [];
    parentheses = 0;
    ansOnScreen = false;
    ans = null;
    error = false;
    inverted = false;
    $('.result').html('');
    $('.screentext').html('');
    $('.hints').html('');
  }

  function toggleInverted() {
    $('.cbfun .inv').toggle();
    inverted = inverted ? false : true;
  }

  function adjustParentheses(num) {
    $('.hints').html(')'.repeat(num));
  }

  function writeToScreen(mode, text) {

    if (mode == 'append') {
      if (error) {
        screenArray = [];
      }
      error = false;
      screenArray.push(text);
    } else if (mode == 'write') {
      screenArray = [text];
    } else if (mode == 'delete') {
      var popped = screenArray.pop();
      if (/[(]$/g.test(popped)) {
        parentheses > 0 ? parentheses-- : parentheses = 0;
        adjustParentheses(parentheses);
      }
    }

    $('.screentext').html(screenArray.join(''));

    if (inverted) {
      toggleInverted();
    }
  }

  function addToExpression(text) {
    expressionArray.push(text);
    expression += text;
  }

  function removeFromExpression() {
    var count = expressionArray.pop().length;
    expression = expression.slice(0, -count);
  }

  // ask for a result ----------------------------------------------------------
  $('.enter').click(
    function() {

      if (ansOnScreen) {
        expressionArray = [ans];
      }

      addToExpression(')'.repeat(parentheses));

      try {
        math.eval(expressionArray.join('')).toPrecision(8);
      } catch (e) {
        error = true;
      }

      if (error) {
        defaults();
        error = true;
        writeToScreen('write', 'Syntax Error');
      } else {
        $('.result').html($('.screentext').html().replace(/Ans/, ans) + ')'.repeat(parentheses) + ' =');
        ans = math.eval(expressionArray.join('')).toPrecision(8);
        writeToScreen('write', ans.toString().replace(/(\.0+$)|(0+$)/g, ''));
        $('.hints').html('');

        var el = $('#screentext');
        var newone = el.clone(true);
        el.before(newone);
        $(".animated:last").remove();

        ansOnScreen = true;
      }
      parentheses = 0;
      expression = '';
      expressionArray = [];
    }
  );

  // clear the screen ----------------------------------------------------------
  $('.cbac').click(
    function() {
      defaults();
    }
  );

  // add a number to the screen ------------------------------------------------
  $('.cbnum').click(
    function() {
      var key = $(this).attr('key');

      if (inverted) {
        toggleInverted();
      }

      if (ansOnScreen) {
        $('.result').html('Ans = ' + $('.screentext').html());
        writeToScreen('write', '');
        ansOnScreen = false;
      }

      addToExpression(key);
      writeToScreen('append', $(this).html());
    }
  );

  // add an operator to the screen if there's no other operator ----------------
  $('.cbop').click(
    function() {
      var key = $(this).attr('key');
      var char = $(this).attr('char');
      if (inverted) {
        toggleInverted();
      }

      if (ansOnScreen) {
        $('.result').html('Ans = ' + $('.screentext').html());
        writeToScreen('write', 'Ans');
        expression = ans;
        expressionArray = [ans];
        parentheses = 0;
        $('.hints').html('');
        ansOnScreen = false;
      }

      if ((/[/]$|[*]$/g.test(expression) && (key == '/' || key == '*'))) {
        writeToScreen('write', $('.screentext').html().replace(/[÷]$|[×]$/g, char));
        removeFromExpression();
        addToExpression(key);
      } else if (/[+]$|[-]$/g.test(expression) && (key == '+' || key == '-')) {
        writeToScreen('write', $('.screentext').html().replace(/[+]$|[-]$/g, char));
        removeFromExpression();
        addToExpression(key);
      } else {
        writeToScreen('append', char);
        addToExpression(key);
      }

      ansOnScreen = false;
    }
  );

  // add a parentheses both to screen and to a global var ----------------------
  $('.cbpar').click(
    function() {
      var key = $(this).attr('key');
      if (inverted) {
        toggleInverted();
      }

      if (ansOnScreen) {
        writeToScreen('write', '');
        ansOnScreen = false;
      }

      addToExpression(key);
      writeToScreen('append', key);

      if (key == '(') {
        parentheses++;
        adjustParentheses(parentheses);
      } else if (key == ')') {
        parentheses > 0 ? parentheses-- : parentheses = 0;
        adjustParentheses(parentheses);
      }

    }

  );

  // add a function, change parentheses ----------------------------------------
  $('.cbfun').click(
    function() {
      var key1 = $(this).attr('key1');
      var key2 = $(this).attr('key2');

      if (ansOnScreen) {
        writeToScreen('write', '');
        ansOnScreen = false;
      }

      if (!inverted) {
        addToExpression(key1);
      } else {
        addToExpression(key2);
      }

      writeToScreen('append', $(this).html() + '(');

      parentheses++;
      adjustParentheses(parentheses);

      if (inverted) {
        toggleInverted();
      }

    }
  );

  // append the old result to the expression-----------------------------------------
  $('.cbans').click(
    function() {
      if (ansOnScreen) {
        writeToScreen('write', '');
        ansOnScreen = false;
      }
      if (!/[Ans]$|[0-9]$|[π]$|[e]$/g.test($('.screentext').html())) {
        addToExpression(ans.toString());
        writeToScreen('append', 'Ans');
      }

    }
  );

  // invert trig functions ----------------------------------------------------------
  $('.cbinv').click(
    function() {
      toggleInverted();
    }
  );

  // backspace -----------------------------------------------------------------------
  $('.cbce').click(
    function() {
      if (inverted) {
        toggleInverted();
      }
      if (ansOnScreen) {
        writeToScreen('write', '');
        ansOnScreen = false;
      }

      if (expressionArray.length) {
        removeFromExpression();
        writeToScreen('delete', '');
      }

    }
  );

  // Insert a random number ---------------------------------------------------------
  $('.cbrnd').click(
    function() {
      var key = Math.random().toPrecision(8);

      if (inverted) {
        toggleInverted();
      }

      if (ansOnScreen) {
        $('.result').html('Ans = ' + $('.screentext').html());
        writeToScreen('write', '');
        ansOnScreen = false;
      }

      addToExpression(key);
      writeToScreen('append', key);
    }
  );

});