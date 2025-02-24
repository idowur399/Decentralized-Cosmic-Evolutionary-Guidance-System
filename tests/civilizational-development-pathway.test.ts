import { describe, it, beforeEach, expect } from "vitest"

describe("Civilizational Development Pathway Contract", () => {
  let mockStorage: Map<string, any>
  let nextCivilizationId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextCivilizationId = 0
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "register-civilization":
        nextCivilizationId++
        mockStorage.set(`civilization-${nextCivilizationId}`, {
          name: args[0],
          development_stage: 1,
          technology_level: 1,
          cultural_complexity: 1,
        })
        return { success: true, value: nextCivilizationId }
      case "advance-civilization":
        const [civId] = args
        const civ = mockStorage.get(`civilization-${civId}`)
        if (!civ) return { success: false, error: 404 }
        civ.development_stage++
        civ.technology_level++
        civ.cultural_complexity++
        return { success: true }
      case "get-civilization-info":
        return { success: true, value: mockStorage.get(`civilization-${args[0]}`) }
      case "calculate-civilization-score":
        const civilization = mockStorage.get(`civilization-${args[0]}`)
        if (!civilization) return { success: false, error: 404 }
        return {
          success: true,
          value: civilization.development_stage + civilization.technology_level + civilization.cultural_complexity,
        }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should register a new civilization", () => {
    const result = mockContractCall("register-civilization", ["Test Civilization"])
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should advance a civilization", () => {
    mockContractCall("register-civilization", ["Test Civilization"])
    const result = mockContractCall("advance-civilization", [1])
    expect(result.success).toBe(true)
  })
  
  it("should get civilization info", () => {
    mockContractCall("register-civilization", ["Test Civilization"])
    const result = mockContractCall("get-civilization-info", [1])
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      name: "Test Civilization",
      development_stage: 1,
      technology_level: 1,
      cultural_complexity: 1,
    })
  })
  
  it("should calculate civilization score", () => {
    mockContractCall("register-civilization", ["Test Civilization"])
    mockContractCall("advance-civilization", [1])
    const result = mockContractCall("calculate-civilization-score", [1])
    expect(result.success).toBe(true)
    expect(result.value).toBe(6)
  })
})

