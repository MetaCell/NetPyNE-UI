export const wait4selector = async (page, selector, settings = {}) => {
  let success = undefined;
  let options = settings;
  if (!("timeout" in settings)) {
    options = { timeout: 5000, ...settings };
  }
  try {
    await page.waitForSelector(selector, options);
    success = true
  } catch (error) {
    let behaviour = "to exists."
    if (options.visible || options.hidden) {
      behaviour = options.visible ? "to be visible." : "to disappear."
    }
    console.log(`ERROR: timeout waiting for selector   --->   ${selector}    ${behaviour}`)
  }
  expect(success).toBeDefined()
}

export const click = async (page, selector) => {
  await wait4selector(page, selector, { visible: true });
  try {
    await page.click(selector);
  } catch (error) {
    // console.log(`ERROR clicking on selector   --->   ${selector} failed.`)
  }
}