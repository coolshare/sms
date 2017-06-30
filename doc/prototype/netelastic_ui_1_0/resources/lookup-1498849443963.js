(function(window, undefined) {
  var dictionary = {
    "d12245cc-1680-458d-89dd-4f0d7fb22724": "Screen 1",
    "652df45b-85fc-42d8-babd-119314c84b6a": "Orstration_map",
    "b3b2f20b-adcc-4c9e-b5c8-a48c344d426a": "orchestration_map_drilldown",
    "6892e88d-b9b9-4ed2-beb0-d78693be7dfc": "orchestration_drilldown",
    "b93f81d6-c887-422f-aa24-c9e473b58a2f": "orchestration",
    "87db3cf7-6bd4-40c3-b29c-45680fb11462": "960 grid - 16 columns",
    "e5f958a4-53ae-426e-8c05-2f7d8e00b762": "960 grid - 12 columns",
    "f39803f7-df02-4169-93eb-7547fb8c961a": "Template 1",
    "43f07378-f493-45c0-93dc-2edeebd4b352": "Orchestration_drilldown",
    "bb8abf58-f55e-472d-af05-a7d1bb0cc014": "default"
  };

  var uriRE = /^(\/#)?(screens|templates|masters|scenarios)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);