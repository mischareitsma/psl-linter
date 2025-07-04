import * as fs from "fs";
import * as path from "path";
import { parseText } from "@mischareitsma/psl-parser";
import * as activate from "../src/activate";
import * as api from "../src/api";

/**
 * Returns the specific diagnostics on a given line
 *
 * @param lineNumber Zero-based line number to check, i.e. line 1 of the document is lineNumber 0.
 * @param diagnostics The reports to filter
 */
export function diagnosticsOnLine(
	lineNumber: number,
	diagnostics: api.Diagnostic[]
): api.Diagnostic[] {
	const lineDiagnostics = diagnostics.filter(r => r.range.start.line === lineNumber);
	return lineDiagnostics;
}

/**
 * Gets the diagnostics for the given file.
 *
 * @param testFileName The name of the file located in `${PROJECT_ROOT}/test/files/`
 * @param ruleName Optional parameter to return only diagnostics corresponding to the ruleName
 */
export function getDiagnostics(
	testFileName: string,
	ruleName?: string
): api.Diagnostic[] {
	const testFilePath = path.resolve("test", "files", testFileName);
	
	const text = fs.readFileSync(testFilePath, {encoding: "utf-8"});

	const profileComponent = new api.ProfileComponent(testFilePath, text);
	const diagnostics = activate.getDiagnostics(profileComponent, parseText(text), false);
	if (ruleName) return diagnostics.filter(d => d.ruleName === ruleName);
	return diagnostics;
}
