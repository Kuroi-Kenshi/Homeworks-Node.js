import { jest } from '@jest/globals'
import { data } from "./data"
import { getDepthSymbol, showObject } from "./utils"

describe("showObject func tests", () => {
  let originalLog;

  beforeEach(() => {
    originalLog = console.log;
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalLog;
  });

  it("should be called the correct number of times", () => {
    showObject(data);
    expect(console.log.mock.calls.length).toBe(18);
  })

  it("should be called 0 number of times", () => {
    showObject({});
    expect(console.log.mock.calls.length).toBe(0);
  })


  it("should be called console.logs with correct params", () => {
    showObject(data);
    expect(console.log.mock.calls[0][0]).toBe('├──');
    expect(console.log.mock.calls[0][1]).toBe(1);
    expect(console.log.mock.calls[1][0]).toBe('| └──');
    expect(console.log.mock.calls[1][1]).toBe(2);
    expect(console.log.mock.calls[2][0]).toBe('|  └──');
    expect(console.log.mock.calls[2][1]).toBe(3);
    expect(console.log.mock.calls[8][0]).toBe('|   └──');
    expect(console.log.mock.calls[8][1]).toBe(9);
    expect(console.log.mock.calls[9][0]).toBe('├──');
  })
})

describe("getDepthSymbol func tests", () => {
  it("should be return correct parent symbol", () => {
    expect(getDepthSymbol('parent')).toBe('├──')
  })

  it("should be return correct child symbol", () => {
    expect(getDepthSymbol()).toBe('|└──')
  })

  it("should be return correct child symbol", () => {
    expect(getDepthSymbol('', 3)).toBe('|   └──')
  })
})