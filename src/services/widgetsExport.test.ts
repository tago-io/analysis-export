import { sortHiddenWidgetsFirst } from "./widgetsExport";

describe("sortHiddenWidgetsFirst", () => {
  const tabs = [
    { key: "tab_visible", type: "" },
    { key: "tab_hidden", type: "hidden" },
  ];

  test("places hidden-tab widgets before visible-tab widgets", () => {
    const arrangement = [
      { widget_id: "visible_a", tab: "tab_visible" },
      { widget_id: "hidden_a", tab: "tab_hidden" },
      { widget_id: "visible_b", tab: "tab_visible" },
      { widget_id: "hidden_b", tab: "tab_hidden" },
    ];

    const sorted = sortHiddenWidgetsFirst(arrangement, tabs);

    expect(sorted.map((x) => x.widget_id)).toEqual(["hidden_a", "hidden_b", "visible_a", "visible_b"]);
  });

  test("identifies hidden tabs by type === 'hidden' on a real dashboard arrangement", () => {
    // Tab "zZoK_1AQCt-iQiI29Yl7e" has type "hidden"; its two widgets must be created first.
    const realTabs = [
      { key: "IujZ8pqDeqGR9wiAVYnqB", type: "", value: "#GLOBAL.OVERVIEW#" },
      { key: "DWCnrWQFhX9Q7pFnLn_ct", type: "", value: "#GLOBAL.HELPER_EN_US#" },
      { key: "lX97Kjts9qumnoOcA7G7Q", type: "", value: "#GLOBAL.HELPER_PT_BR#" },
      { key: "zZoK_1AQCt-iQiI29Yl7e", type: "hidden", value: "#GLOBAL.HIDDEN#" },
    ];
    const realArrangement = [
      { tab: "IujZ8pqDeqGR9wiAVYnqB", widget_id: "6a32b0f1d3f020000ca5c208" },
      { tab: "DWCnrWQFhX9Q7pFnLn_ct", widget_id: "6a32b0f3d5cee5000c54b207" },
      { tab: "lX97Kjts9qumnoOcA7G7Q", widget_id: "6a32b0f4c4325f000c7358cc" },
      { tab: "zZoK_1AQCt-iQiI29Yl7e", widget_id: "6a32b0f2c4325f000c735866" },
      { tab: "zZoK_1AQCt-iQiI29Yl7e", widget_id: "6a32b0f2bf4706000c01817b" },
    ];

    const sorted = sortHiddenWidgetsFirst(realArrangement, realTabs);

    expect(sorted.slice(0, 2).map((x) => x.widget_id)).toEqual(["6a32b0f2c4325f000c735866", "6a32b0f2bf4706000c01817b"]);
  });

  test("does not mutate the original arrangement", () => {
    const arrangement = [
      { widget_id: "visible_a", tab: "tab_visible" },
      { widget_id: "hidden_a", tab: "tab_hidden" },
    ];
    const original = [...arrangement];

    sortHiddenWidgetsFirst(arrangement, tabs);

    expect(arrangement).toEqual(original);
  });
});
