/**
 ******************************************************************************
 *                                functions                                    *
 ******************************************************************************
 */
function moveToTab (casper, test, tabID, elementID, elementType) {
  casper.then(function () {
    toolbox.active.tabID = tabID
    this.click('button[id="' + tabID + '"]', function () {
      this.echo("changing tab...")
    })
  })
  casper.then(function () {
    this.waitUntilVisible(elementType + '[id="' + elementID + '"]', function () {
      test.assertExist(elementType + '[id="' + elementID + '"]', "changed tab")
    })
  })
  casper.then(function () {
    this.wait(2000)
  })
}

// ----------------------------------------------------------------------------//
function leaveReEnterTab (casper, test, mainTabID, mainTabElementID, secondTabID, SecondTabElementID, mainElementType = "input") {
  casper.thenClick('button[id="' + secondTabID + '"]', function () {
    this.waitUntilVisible('input[id="' + SecondTabElementID + '"]')
  });
  casper.thenClick('button[id="' + mainTabID + '"]', function () {
    this.wait(1500) // for python to re-populate fields
  })
  casper.then(function () {
    this.waitUntilVisible(mainElementType + '[id="' + mainTabElementID + '"]', function () {
      this.echo("leave and re-enter " + mainTabID + " tab")
    })
  })
  casper.then(function () {
    this.wait(2000) // for python to repopulate tab
  })
}

// ----------------------------------------------------------------------------//
function leaveReEnterRule (casper, test, mainThumbID, secondThumbID, elementID, type = "input") {
  casper.thenClick('button[id="' + secondThumbID + '"]', function () { // move to another Rule thumbnail
    this.waitUntilVisible(type + '[id="' + elementID + '"]', function () {
      this.wait(2000)
    })
  })
  casper.thenClick('button[id="' + mainThumbID + '"]', function () {
    this.waitUntilVisible(type + '[id="' + elementID + '"]', function () {
      this.echo("moved to different Rule and came back")
    })
  })
  casper.then(function () {
    this.wait(2000)
  })
}
// ----------------------------------------------------------------------------//
function create2rules (casper, test, cardID, addButtonID, ruleThumbID) {
  casper.then(function () {
    this.waitUntilVisible('div[id="' + cardID + '"]', function () {
      this.click('div[id="' + cardID + '"]'); // open Card
    })
  })

  casper.then(function () {
    this.wait(1000)
  })

  casper.then(function () { // check ADD button exist
    this.waitUntilVisible('button[id="' + addButtonID + '"]', function () {
      test.assertExist('button[id="' + addButtonID + '"]', "open card")
    });
  })

  casper.then(function () {
    this.wait(1000)
  })

  casper.thenClick('button[id="' + addButtonID + '"]', function () { // add new rule
    this.waitUntilVisible('button[id="' + ruleThumbID + '"]', function () {
      test.assertExist('button[id="' + ruleThumbID + '"]', "rule added");
    })
  })

  casper.then(function () {
    this.wait(1000)
  })

  casper.thenClick('button[id="' + addButtonID + '"]', function () { // add new rule
    this.waitUntilVisible('button[id="' + ruleThumbID + '2"]', function () {
      test.assertExist('button[id="' + ruleThumbID + '2"]', "rule added");
    })
  })

  casper.thenClick('button[id="' + ruleThumbID + '"]', function () { // focus on first rule
    this.wait(2500)
  })
}

// ----------------------------------------------------------------------------//
function renameRule (casper, test, elementID, value) {
  casper.then(function () {
    this.waitUntilVisible('input[id="' + elementID + '"]')
  })
  casper.then(function () {
    this.sendKeys('input[id="' + elementID + '"]', value, { reset: true })
  })
  casper.then(function () { // let python re-populate fields 
    this.wait(2000)
  })
  casper.then(function () {
    var currentValue = this.getElementAttribute('input[id="' + elementID + '"]', 'value');
    test.assertEqual(currentValue, value, "Rule renamed to: " + value)
  })
}

// ----------------------------------------------------------------------------//
function selectThumbRule (casper, test, thumbID, nameFieldID) { // select a thumbnailRule and wait to load data
  casper.thenClick('button[id="' + thumbID + '"]', function () { // focus on rule 1
    this.waitUntilVisible('input[id="' + nameFieldID + '"]')
  })
  casper.then(function () {
    this.wait(2000)
  })
}

// ----------------------------------------------------------------------------//
function delThumbnail (casper, test, elementID) {
  casper.then(function () { // click thumbnail
    this.waitUntilVisible('button[id="' + elementID + '"]', function () {
      this.mouse.click('button[id="' + elementID + '"]');
    })
  })
  casper.then(function () { // move mouse into thumbnail
    this.mouse.move('button[id="' + elementID + '"]')
  })
  casper.then(function () {
    this.wait(500)
  })
  casper.then(function () { // click thumbnail
    this.mouse.click('button[id="' + elementID + '"]')
  })
  casper.then(function () { // confirm deletion
    this.waitUntilVisible('button[id="confirmDeletion"]', function () {
      this.click('button[id="confirmDeletion"]')
    })
  })
  casper.then(function () {
    this.waitWhileVisible('button[id="' + elementID + '"]', function () {
      test.assertDoesntExist('button[id="' + elementID + '"]', elementID + " button deleted")
    })
  })
}

// ----------------------------------------------------------------------------//
function setInputValue (casper, test, elementID, value) {
  casper.then(function () {
    this.waitUntilVisible('input[id="' + elementID + '"]', function () {})
  })
  casper.thenEvaluate(function (elementID, value) { // this hack breaks for latest React!!!!!
    var element = document.getElementById(elementID);
    var ev = new Event('input', { bubbles: true });
    ev.simulated = true;
    element.value = value;
    element.dispatchEvent(ev);
  }, elementID, value);
  casper.then(function () {
    test.assert(true, value + " set for: " + elementID)
  })
}

// ----------------------------------------------------------------------------//
function getInputValue (casper, test, elementID, expectedValue, times = 3) {
  casper.then(function () {
    this.waitUntilVisible('input[id="' + elementID + '"]')
  })
  casper.then(function () {
    var value = this.evaluate(function (elementID) {
      return $('input[id="' + elementID + '"]').val();
    }, elementID);

    // required in case python fails to update field
    secondChance(this, test, value, expectedValue, elementID, getInputValue, times)
  })
}

// ----------------------------------------------------------------------------//
function getlistItemValues (casper, test, elementID, expectedValues, times = 3) {
  var elementIDs = expectedValues.map((elem, i) => elementID + i)
  var failed = false
  casper.then(function (){
    this.each(elementIDs, function (self, el) {
      self.waitUntilVisible('input[id="' + el + '"]')
    })
  })
  
  casper.then(function () {
    var values = elementIDs.map(el => this.evaluate(function (el) {
      return $('input[id="' + el + '"]').val();
    }, el))
    expectedValues.forEach(el => {
      if (values.indexOf(el) == -1) {
        // required in case python fails to update field
        secondChance(this, test, values, expectedValues, elementID, getlistItemValues, times)    
        var failed = true
      }
    })
    if (!failed) {
      test.assert(true, expectedValues + " found in: " + elementID)
    }
  })
}

// ----------------------------------------------------------------------------//
function setSelectFieldValue (casper, test, selectFieldID, menuItemID) {
  casper.then(function () {
    this.waitUntilVisible('div[id="' + selectFieldID + '"]')
  })
  casper.thenEvaluate(function (selectFieldID) {
    document.getElementById(selectFieldID).scrollIntoView();
  }, selectFieldID);

  casper.then(function () { // click selectField
    var info = casper.getElementInfo('div[id="' + selectFieldID + '"]');
    this.mouse.click(info.x + 1, info.y + 1)
  })

  casper.then(function () {
    this.wait(500) // wait for the menuitem animation to finish
  })
  casper.then(function () { // click menuItem
    this.waitUntilVisible('span[id="' + menuItemID + '"]', function () {
      var info = this.getElementInfo('span[id="' + menuItemID + '"]');
      this.mouse.click(info.x + 1, info.y + 1)
    })
  })
  casper.then(function () { // click outside selectField
    var info = this.getElementInfo('div[id="' + selectFieldID + '"]');
    this.mouse.click(info.x - 10, info.y)
  })
  casper.then(function () {
    this.wait(500) // wait for MenuItem animation to vanish
  })
  casper.then(function () { // check value is ok
    this.waitWhileVisible('span[id="' + menuItemID + '"]', function () {
      this.echo("click on " + menuItemID)
    })
  })
}

// ----------------------------------------------------------------------------//
function getSelectFieldValue (casper, test, elementID, expected, times = 3) {
  casper.then(function () {
    this.waitUntilVisible('div[id="' + elementID + '"]')
  })

  casper.then(function () {
    var value = this.evaluate(function (elementID) {
      return document.getElementById(elementID).getElementsByTagName("div")[0].textContent;
    }, elementID)

    secondChance(this, test, value, expected, elementID, getSelectFieldValue, times)
  });
}

// ----------------------------------------------------------------------------//
function addListItem (casper, test, elementID, value) {
  casper.then(function () {
    setInputValue(this, test, elementID, value)
  })
  casper.then(function () {
    click(this, elementID + "AddButton", "button")
  })
}

// ----------------------------------------------------------------------------//
function deleteListItem (casper, test, elementID) {
  casper.then(function () {
    this.waitUntilVisible('button[id="' + elementID + 'RemoveButton"]')
  })
  casper.thenClick('button[id="' + elementID + 'RemoveButton"]')

  casper.then(function () {
    this.waitWhileVisible('input[id="' + elementID + '"]')
  })
  casper.then(function () {
    this.echo("item removed from list: " + elementID)
    this.wait(2000)
  })
}

// ----------------------------------------------------------------------------//
function getListItemValue (casper, test, elementID, value, times = 3) {
  casper.then(function () {
    this.waitUntilVisible('input[id="' + elementID + '"]', function () {}, function () {
      secondChance(this, test, 'not-visible', value, elementID, getListItemValue, times)
    })
  })
  casper.thenBypassIf(function () {
    return (!this.visible('input[id="' + elementID + '"]') && times > 0)
  })
  casper.then(function () {
    var newValue = this.evaluate(function (elementID) {
      return $('input[id="' + elementID + '"]').val();
    }, elementID);
    // required in case python fails to update field
    secondChance(this, test, newValue, value, elementID, getListItemValue, times)
  })
}

// ----------------------------------------------------------------------------//
function testCheckBoxValue (casper, test, elementID, expectedName, times = 3) {
  casper.then(function () {
    this.waitUntilVisible('input[id="' + elementID + '"]')
  })
  casper.then(function () {
    var name = casper.evaluate(function (elementID) {
      return $('input[id="' + elementID + '"]').prop('checked');
    }, elementID);
    secondChance(this, test, name, expectedName, elementID, testCheckBoxValue, times)
  })
}

// ----------------------------------------------------------------------------//
function clickCheckBox (casper, test, elementID) {
  casper.then(function () {
    this.waitUntilVisible('input[id="' + elementID + '"]', function () {
      this.click('input[id="' + elementID + '"]');
    });
  })
}

// ----------------------------------------------------------------------------//
function assertExist (casper, test, elementID, component = "input", message = false) {
  casper.then(function () {
    this.waitUntilVisible(component + '[id="' + elementID + '"]', function () {
      test.assertExist(component + '[id="' + elementID + '"]', message ? message : component + ": " + elementID + " exist")
    })
  })
}

// ----------------------------------------------------------------------------//
function assertDoesntExist (casper, test, elementID, component = "input", message = false) {
  casper.then(function () {
    this.waitWhileVisible(component + '[id="' + elementID + '"]', function () {
      test.assertDoesntExist(component + '[id="' + elementID + '"]', message ? message : component + ": " + elementID + " doesn't exist")
    })
  })
}

// ----------------------------------------------------------------------------//
function message (casper, message) {
  casper.then(function () {
    this.echo("<" + message.toUpperCase() + ">", "INFO")
  })
}

// ----------------------------------------------------------------------------//
function header (casper, message) {
  casper.then(function () {
    this.echo("#".repeat(message.length + 10), "INFO")
    this.echo(" ".repeat(5) + message.toUpperCase() + " ".repeat(5), "INFO");
    this.echo("#".repeat(message.length + 10), "INFO")
  })
}

// ----------------------------------------------------------------------------//
function click (casper, elementID, type = "div") {
  casper.then(function () {
    this.waitUntilVisible(type + '[id="' + elementID + '"]')
  })
  casper.then(function () {
    this.evaluate(function (elementID) {
      document.getElementById(elementID).scrollIntoView();
    }, elementID);
  })
  casper.then(function () {
    this.waitUntilVisible(type + '[id="' + elementID + '"]')
  })
  casper.then(function () {
    this.wait(500) // wait for animation in dropDownMenu to complete
  })
  casper.then(function () {
    var info = this.getElementInfo(type + '[id="' + elementID + '"]');
    this.mouse.click(info.x + 1, info.y + 1); // move a bit away from corner
  })
  casper.then(function () {
    this.echo("Click on " + elementID)
    this.wait(300)
  })
}

// ------------------------------------------------------------------------------
function refresh (casper, test, expected, got, times) {
  /*
   * "active" object points to the current: "Card", "Add-newRule-Button" and "Tab"
   * to allow refreshing in case a field did not get the correct value 
   */
  casper.then(function () {
    this.echo("WARNING-->  expected: " + expected + "   got: " + (got ? got : "empty") + "    trying again " + (3 - times) + "/3", "WARNING")
  })
  casper.then(function () {
    this.click('div[id="' + toolbox.active.cardID + '"]')
  })
  casper.then(function () {
    this.waitWhileVisible('div[id="' + toolbox.active.buttonID + '"]', function () {
      this.click('div[id="' + toolbox.active.cardID + '"]')
    })
  })
  casper.then(function () {
    if (toolbox.active.tabID) {
      this.waitUntilVisible('button[id="' + toolbox.active.tabID + '"]', function () {
        this.click('button[id="' + toolbox.active.tabID + '"]')
      })
    } else {
      this.waitUntilVisible('button[id="' + toolbox.active.buttonID + '"]')
    }
  })
  casper.then(function () {
    this.wait(2000)
  })
}

// ----------------------------------------------------------------------------//
function secondChance (casper, test, value, expectedValue, elementID, callback, times) {
  casper.then(function () {
    if (value != expectedValue && times > 0) {
      --times
      this.then(function () {
        refresh(this, test, expectedValue, value, times)
      })
      this.then(function () {
        callback(this, test, elementID, expectedValue, times)
      })
    } else {
      test.assertEquals(value, expectedValue, (expectedValue ? expectedValue : "(empty)") + " found in: " + elementID);
    }
  })
}
// ----------------------------------------------------------------------------//
function testPlotButton (casper, test, plotButton) {
  casper.then(function () {
    this.waitUntilVisible('span[id="' + plotButton + '"]');
  })
  casper.thenEvaluate(function (plotButton) {
    document.getElementById(plotButton).click();
  }, plotButton);
  
  casper.then(function () {
    this.waitUntilVisible('div[id="Popup1"]', function () {
      test.assertExists('div[id="Popup1"]', plotButton + " exists");
    })
  })
  casper.then(function () {
    this.waitUntilVisible('g[id="figure_1"]')
    this.waitUntilVisible('g[id="axes_1"]')
  });
  casper.thenEvaluate(function () {
    window['Popup1'].destroy();
  });
  
  casper.then(function (){
    this.waitWhileVisible('div[id="Popup1"]', function () {
      test.assertDoesntExist('div[id="Popup1"]', plotButton + " was destroyed successfully");
    });
  })  
  
  casper.then(function () {
    var plotError = test.assertEvalEquals(function () {
      var error = document.getElementById("netPyneDialog") == undefined;
      if (!error) {
        document.getElementById("netPyneDialog").click();
      }
      return error;
    }, true, "no error on: " + plotButton);
  });
}
// ----------------------------------------------------------------------------//
var toolbox = module.exports = {
  click: click,
  header: header,
  message: message,
  moveToTab: moveToTab,
  leaveReEnterTab: leaveReEnterTab,
  leaveReEnterRule: leaveReEnterRule,
  renameRule: renameRule,
  create2rules: create2rules,
  delThumbnail: delThumbnail,
  selectThumbRule: selectThumbRule,
  setInputValue: setInputValue,
  getInputValue: getInputValue,
  getlistItemValues: getlistItemValues,
  setSelectFieldValue: setSelectFieldValue,
  getSelectFieldValue: getSelectFieldValue,
  addListItem: addListItem,
  deleteListItem: deleteListItem,
  getListItemValue: getListItemValue,
  clickCheckBox: clickCheckBox,
  testCheckBoxValue: testCheckBoxValue,
  assertExist: assertExist,
  assertDoesntExist: assertDoesntExist,
  active: {},
  testPlotButton: testPlotButton
}
