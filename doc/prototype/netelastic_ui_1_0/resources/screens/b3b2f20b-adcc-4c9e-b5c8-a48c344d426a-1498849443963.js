jQuery("#simulation")
  .on("click", ".s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a .click", function(event, data) {
    var jEvent, jFirer, cases;
    if(data === undefined) { data = event; }
    jEvent = jimEvent(event);
    jFirer = jEvent.getEventFirer();
    if(jFirer.is("#s-Image_1")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/652df45b-85fc-42d8-babd-119314c84b6a"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Label_37")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/d12245cc-1680-458d-89dd-4f0d7fb22724"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Rectangle_4")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/652df45b-85fc-42d8-babd-119314c84b6a"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Label_41")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/6892e88d-b9b9-4ed2-beb0-d78693be7dfc"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Label_42")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/652df45b-85fc-42d8-babd-119314c84b6a"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    }
  })
  .on("mouseenter dragenter", ".s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a .mouseenter", function(event, data) {
    var jEvent, jFirer, cases;
    if(data === undefined) { data = event; }
    jEvent = jimEvent(event);
    jFirer = jEvent.getDirectEventFirer(this);
    if(jFirer.is("#s-Label_37") && jFirer.has(event.relatedTarget).length === 0) {
      event.backupState = true;
      event.target = jFirer;
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_37": {
                      "attributes": {
                        "font-size": "11.0pt",
                        "font-family": "'Arial',Arial"
                      }
                    }
                  },{
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_37 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_37 span": {
                      "attributes": {
                        "color": "#005580",
                        "text-align": "center",
                        "text-decoration": "underline",
                        "font-family": "'Arial',Arial",
                        "font-size": "11.0pt",
                        "font-style": "normal",
                        "font-weight": "400"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Label_38") && jFirer.has(event.relatedTarget).length === 0) {
      event.backupState = true;
      event.target = jFirer;
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_38": {
                      "attributes": {
                        "font-size": "11.0pt",
                        "font-family": "'Arial',Arial"
                      }
                    }
                  },{
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_38 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_38 span": {
                      "attributes": {
                        "color": "#005580",
                        "text-align": "center",
                        "text-decoration": "underline",
                        "font-family": "'Arial',Arial",
                        "font-size": "11.0pt",
                        "font-style": "normal",
                        "font-weight": "400"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Label_40") && jFirer.has(event.relatedTarget).length === 0) {
      event.backupState = true;
      event.target = jFirer;
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_40": {
                      "attributes": {
                        "font-size": "11.0pt",
                        "font-family": "'Arial',Arial"
                      }
                    }
                  },{
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_40 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_40 span": {
                      "attributes": {
                        "color": "#005580",
                        "text-align": "center",
                        "text-decoration": "underline",
                        "font-family": "'Arial',Arial",
                        "font-size": "11.0pt",
                        "font-style": "normal",
                        "font-weight": "400"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Label_41") && jFirer.has(event.relatedTarget).length === 0) {
      event.backupState = true;
      event.target = jFirer;
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_41": {
                      "attributes": {
                        "font-size": "11.0pt",
                        "font-family": "'Arial',Arial"
                      }
                    }
                  },{
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_41 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_41 span": {
                      "attributes": {
                        "color": "#005580",
                        "text-align": "center",
                        "text-decoration": "underline",
                        "font-family": "'Arial',Arial",
                        "font-size": "11.0pt",
                        "font-style": "normal",
                        "font-weight": "400"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Label_42") && jFirer.has(event.relatedTarget).length === 0) {
      event.backupState = true;
      event.target = jFirer;
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_42": {
                      "attributes": {
                        "font-size": "11.0pt",
                        "font-family": "'Arial',Arial"
                      }
                    }
                  },{
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_42 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a #s-Label_42 span": {
                      "attributes": {
                        "color": "#005580",
                        "text-align": "center",
                        "text-decoration": "underline",
                        "font-family": "'Arial',Arial",
                        "font-size": "11.0pt",
                        "font-style": "normal",
                        "font-weight": "400"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      jEvent.launchCases(cases);
    }
  })
  .on("mouseleave dragleave", ".s-b3b2f20b-adcc-4c9e-b5c8-a48c344d426a .mouseleave", function(event, data) {
    var jEvent, jFirer, cases;
    if(data === undefined) { data = event; }
    jEvent = jimEvent(event);
    jFirer = jEvent.getDirectEventFirer(this);
    if(jFirer.is("#s-Label_37")) {
      jEvent.undoCases(jFirer);
    } else if(jFirer.is("#s-Label_38")) {
      jEvent.undoCases(jFirer);
    } else if(jFirer.is("#s-Label_40")) {
      jEvent.undoCases(jFirer);
    } else if(jFirer.is("#s-Label_41")) {
      jEvent.undoCases(jFirer);
    } else if(jFirer.is("#s-Label_42")) {
      jEvent.undoCases(jFirer);
    }
  });