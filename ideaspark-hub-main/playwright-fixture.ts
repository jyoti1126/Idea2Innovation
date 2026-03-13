// Re-export the base fixture from the official Playwright package
// Override or extend test/expect here if needed
import { test as base, expect } from "@playwright/test";

// Agar aapko custom fixtures add nahi karni hain, toh seedha ye export karein:
export { base as test, expect };