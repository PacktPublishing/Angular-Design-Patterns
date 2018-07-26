/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("tsickle/src/es5processor", ["require", "exports", "tsickle/src/rewriter", "tsickle/src/typescript", "tsickle/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rewriter_1 = require("tsickle/src/rewriter");
    var ts = require("tsickle/src/typescript");
    var util_1 = require("tsickle/src/util");
    /**
     * Extracts the namespace part of a goog: import, or returns null if the given
     * import is not a goog: import.
     */
    function extractGoogNamespaceImport(tsImport) {
        if (tsImport.match(/^goog:/))
            return tsImport.substring('goog:'.length);
        return null;
    }
    exports.extractGoogNamespaceImport = extractGoogNamespaceImport;
    /**
     * ES5Processor postprocesses TypeScript compilation output JS, to rewrite commonjs require()s into
     * goog.require(). Contrary to its name it handles converting the modules in both ES5 and ES6
     * outputs.
     */
    var ES5Processor = /** @class */ (function (_super) {
        __extends(ES5Processor, _super);
        function ES5Processor(host, file) {
            var _this = _super.call(this, file) || this;
            _this.host = host;
            /**
             * namespaceImports collects the variables for imported goog.modules.
             * If the original TS input is:
             *   import foo from 'goog:bar';
             * then TS produces:
             *   var foo = require('goog:bar');
             * and this class rewrites it to:
             *   var foo = require('goog.bar');
             * After this step, namespaceImports['foo'] is true.
             * (This is used to rewrite 'foo.default' into just 'foo'.)
             */
            _this.namespaceImports = new Set();
            /**
             * moduleVariables maps from module names to the variables they're assigned to.
             * Continuing the above example, moduleVariables['goog.bar'] = 'foo'.
             */
            _this.moduleVariables = new Map();
            /** strippedStrict is true once we've stripped a "use strict"; from the input. */
            _this.strippedStrict = false;
            /** unusedIndex is used to generate fresh symbols for unnamed imports. */
            _this.unusedIndex = 0;
            return _this;
        }
        ES5Processor.prototype.process = function () {
            var moduleId = this.host.fileNameToModuleId(this.file.fileName);
            // TODO(evanm): only emit the goog.module *after* the first comment,
            // so that @suppress statements work.
            var moduleName = this.host.pathToModuleName('', this.file.fileName);
            // NB: No linebreak after module call so sourcemaps are not offset.
            this.emit("goog.module('" + moduleName + "');");
            if (this.host.prelude)
                this.emit(this.host.prelude);
            // Allow code to use `module.id` to discover its module URL, e.g. to resolve
            // a template URL against.
            // Uses 'var', as this code is inserted in ES6 and ES5 modes.
            // The following pattern ensures closure doesn't throw an error in advanced
            // optimizations mode.
            if (this.host.es5Mode) {
                this.emit("var module = module || {id: '" + moduleId + "'};");
            }
            else {
                // The `exports = {}` serves as a default export to disable Closure Compiler's error checking
                // for mutable exports. That's OK because TS compiler makes sure that consuming code always
                // accesses exports through the module object, so mutable exports work.
                // It is only inserted in ES6 because we strip `.default` accesses in ES5 mode, which breaks
                // when assigning an `exports = {}` object and then later accessing it.
                this.emit(" exports = {}; var module = {id: '" + moduleId + "'};");
            }
            var pos = 0;
            try {
                for (var _a = __values(this.file.statements), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var stmt = _b.value;
                    this.writeRange(this.file, pos, stmt.getFullStart());
                    this.visitTopLevel(stmt);
                    pos = stmt.getEnd();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.writeRange(this.file, pos, this.file.getEnd());
            var referencedModules = Array.from(this.moduleVariables.keys());
            // Note: don't sort referencedModules, as the keys are in the same order
            // they occur in the source file.
            var output = this.getOutput().output;
            return { output: output, referencedModules: referencedModules };
            var e_1, _c;
        };
        /**
         * visitTopLevel processes a top-level ts.Node and emits its contents.
         *
         * It's separate from the normal Rewriter recursive traversal
         * because some top-level statements are handled specially.
         */
        ES5Processor.prototype.visitTopLevel = function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.ExpressionStatement:
                    // Check for "use strict" and skip it if necessary.
                    if (!this.strippedStrict && this.isUseStrict(node)) {
                        this.emitCommentWithoutStatementBody(node);
                        this.strippedStrict = true;
                        return;
                    }
                    // Check for:
                    // - "require('foo');" (a require for its side effects)
                    // - "__export(require(...));" (an "export * from ...")
                    if (this.emitRewrittenRequires(node)) {
                        return;
                    }
                    // Check for
                    //   Object.defineProperty(exports, "__esModule", ...);
                    if (this.isEsModuleProperty(node)) {
                        this.emitCommentWithoutStatementBody(node);
                        return;
                    }
                    // Otherwise fall through to default processing.
                    break;
                case ts.SyntaxKind.VariableStatement:
                    // Check for a "var x = require('foo');".
                    if (this.emitRewrittenRequires(node))
                        return;
                    break;
                default:
                    break;
            }
            this.visit(node);
        };
        /**
         * The TypeScript AST attaches comments to statement nodes, so even if a node
         * contains code we want to skip emitting, we need to emit the attached
         * comment(s).
         */
        ES5Processor.prototype.emitCommentWithoutStatementBody = function (node) {
            this.writeLeadingTrivia(node);
        };
        /** isUseStrict returns true if node is a "use strict"; statement. */
        ES5Processor.prototype.isUseStrict = function (node) {
            if (node.kind !== ts.SyntaxKind.ExpressionStatement)
                return false;
            var exprStmt = node;
            var expr = exprStmt.expression;
            if (expr.kind !== ts.SyntaxKind.StringLiteral)
                return false;
            var literal = expr;
            return literal.text === 'use strict';
        };
        /**
         * emitRewrittenRequires rewrites require()s into goog.require() equivalents.
         *
         * @return True if the node was rewritten, false if needs ordinary processing.
         */
        ES5Processor.prototype.emitRewrittenRequires = function (node) {
            // We're looking for requires, of one of the forms:
            // - "var importName = require(...);".
            // - "require(...);".
            if (node.kind === ts.SyntaxKind.VariableStatement) {
                // It's possibly of the form "var x = require(...);".
                var varStmt = node;
                // Verify it's a single decl (and not "var x = ..., y = ...;").
                if (varStmt.declarationList.declarations.length !== 1)
                    return false;
                var decl = varStmt.declarationList.declarations[0];
                // Grab the variable name (avoiding things like destructuring binds).
                if (decl.name.kind !== ts.SyntaxKind.Identifier)
                    return false;
                var varName = rewriter_1.getIdentifierText(decl.name);
                if (!decl.initializer || decl.initializer.kind !== ts.SyntaxKind.CallExpression)
                    return false;
                var call = decl.initializer;
                var require_1 = this.isRequire(call);
                if (!require_1)
                    return false;
                this.writeLeadingTrivia(node);
                this.emitGoogRequire(varName, require_1);
                return true;
            }
            else if (node.kind === ts.SyntaxKind.ExpressionStatement) {
                // It's possibly of the form:
                // - require(...);
                // - __export(require(...));
                // - tslib_1.__exportStar(require(...));
                // All are CallExpressions.
                var exprStmt = node;
                var expr = exprStmt.expression;
                if (expr.kind !== ts.SyntaxKind.CallExpression)
                    return false;
                var call = expr;
                var require_2 = this.isRequire(call);
                var isExport = false;
                if (!require_2) {
                    // If it's an __export(require(...)), we emit:
                    //   var x = require(...);
                    //   __export(x);
                    // This extra variable is necessary in case there's a later import of the
                    // same module name.
                    var innerCall = this.isExportRequire(call);
                    if (!innerCall)
                        return false;
                    isExport = true;
                    call = innerCall; // Update call to point at the require() expression.
                    require_2 = this.isRequire(call);
                }
                if (!require_2)
                    return false;
                this.writeLeadingTrivia(node);
                var varName = this.emitGoogRequire(null, require_2);
                if (isExport) {
                    // node is a statement containing a require() in it, while
                    // requireCall is that call.  We replace the require() call
                    // with the variable we emitted.
                    var fullStatement = node.getText();
                    var requireCall = call.getText();
                    this.emit(fullStatement.replace(requireCall, varName));
                }
                return true;
            }
            else {
                // It's some other type of statement.
                return false;
            }
        };
        /**
         * Emits a goog.require() statement for a given variable name and TypeScript import.
         *
         * E.g. from:
         *   var varName = require('tsImport');
         * produces:
         *   var varName = goog.require('goog.module.name');
         *
         * If the input varName is null, generates a new variable name if necessary.
         *
         * @return The variable name for the imported module, reusing a previous import if one
         *    is available.
         */
        ES5Processor.prototype.emitGoogRequire = function (varName, tsImport) {
            var modName;
            var isNamespaceImport = false;
            var nsImport = extractGoogNamespaceImport(tsImport);
            if (nsImport !== null) {
                // This is a namespace import, of the form "goog:foo.bar".
                // Fix it to just "foo.bar".
                modName = nsImport;
                isNamespaceImport = true;
            }
            else {
                modName = this.host.pathToModuleName(this.file.fileName, tsImport);
            }
            if (!varName) {
                var mv = this.moduleVariables.get(modName);
                if (mv) {
                    // Caller didn't request a specific variable name and we've already
                    // imported the module, so just return the name we already have for this module.
                    return mv;
                }
                // Note: we always introduce a variable for any import, regardless of whether
                // the caller requested one.  This avoids a Closure error.
                varName = this.generateFreshVariableName();
            }
            if (isNamespaceImport)
                this.namespaceImports.add(varName);
            if (this.moduleVariables.has(modName)) {
                this.emit("var " + varName + " = " + this.moduleVariables.get(modName) + ";");
            }
            else {
                this.emit("var " + varName + " = goog.require('" + modName + "');");
                this.moduleVariables.set(modName, varName);
            }
            return varName;
        };
        // workaround for syntax highlighting bug in Sublime: `
        /**
         * Returns the string argument if call is of the form
         *   require('foo')
         */
        ES5Processor.prototype.isRequire = function (call) {
            // Verify that the call is a call to require(...).
            if (call.expression.kind !== ts.SyntaxKind.Identifier)
                return null;
            var ident = call.expression;
            if (rewriter_1.getIdentifierText(ident) !== 'require')
                return null;
            // Verify the call takes a single string argument and grab it.
            if (call.arguments.length !== 1)
                return null;
            var arg = call.arguments[0];
            if (arg.kind !== ts.SyntaxKind.StringLiteral)
                return null;
            return arg.text;
        };
        /**
         * Returns the require() call node if the outer call is of the forms:
         * - __export(require('foo'))
         * - tslib_1.__exportStar(require('foo'), bar)
         */
        ES5Processor.prototype.isExportRequire = function (call) {
            switch (call.expression.kind) {
                case ts.SyntaxKind.Identifier:
                    var ident = call.expression;
                    // TS_24_COMPAT: accept three leading underscores
                    if (ident.text !== '__export' && ident.text !== '___export') {
                        return null;
                    }
                    break;
                case ts.SyntaxKind.PropertyAccessExpression:
                    var propAccess = call.expression;
                    // TS_24_COMPAT: accept three leading underscores
                    if (propAccess.name.text !== '__exportStar' && propAccess.name.text !== '___exportStar') {
                        return null;
                    }
                    break;
                default:
                    return null;
            }
            // Verify the call takes at least one argument and check it.
            if (call.arguments.length < 1)
                return null;
            var arg = call.arguments[0];
            if (arg.kind !== ts.SyntaxKind.CallExpression)
                return null;
            var innerCall = arg;
            if (!this.isRequire(innerCall))
                return null;
            return innerCall;
        };
        ES5Processor.prototype.isEsModuleProperty = function (expr) {
            // We're matching the explicit source text generated by the TS compiler.
            return expr.getText() === 'Object.defineProperty(exports, "__esModule", { value: true });';
        };
        /**
         * maybeProcess is called during the recursive traversal of the program's AST.
         *
         * @return True if the node was processed/emitted, false if it should be emitted as is.
         */
        ES5Processor.prototype.maybeProcess = function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.PropertyAccessExpression:
                    var propAccess = node;
                    // We're looking for an expression of the form:
                    //   module_name_var.default
                    if (rewriter_1.getIdentifierText(propAccess.name) !== 'default')
                        break;
                    if (propAccess.expression.kind !== ts.SyntaxKind.Identifier)
                        break;
                    var lhs = rewriter_1.getIdentifierText(propAccess.expression);
                    if (!this.namespaceImports.has(lhs))
                        break;
                    // Emit the same expression, with spaces to replace the ".default" part
                    // so that source maps still line up.
                    this.writeLeadingTrivia(node);
                    this.emit(lhs + "        ");
                    return true;
                default:
                    break;
            }
            return false;
        };
        /** Generates a new variable name inside the tsickle_ namespace. */
        ES5Processor.prototype.generateFreshVariableName = function () {
            return "tsickle_module_" + this.unusedIndex++ + "_";
        };
        return ES5Processor;
    }(rewriter_1.Rewriter));
    /**
     * Converts TypeScript's JS+CommonJS output to Closure goog.module etc.
     * For use as a postprocessing step *after* TypeScript emits JavaScript.
     *
     * @param fileName The source file name.
     * @param moduleId The "module id", a module-identifying string that is
     *     the value module.id in the scope of the module.
     * @param pathToModuleName A function that maps a filesystem .ts path to a
     *     Closure module name, as found in a goog.require('...') statement.
     *     The context parameter is the referencing file, used for resolving
     *     imports with relative paths like "import * as foo from '../foo';".
     * @param prelude An additional prelude to insert after the `goog.module` call,
     *     e.g. with additional imports or requires.
     */
    function processES5(host, fileName, content) {
        var file = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES5, true);
        return new ES5Processor(host, file).process();
    }
    exports.processES5 = processES5;
    function convertCommonJsToGoogModuleIfNeeded(host, modulesManifest, fileName, content) {
        if (!host.googmodule || util_1.isDtsFileName(fileName)) {
            return content;
        }
        var _a = processES5(host, fileName, content), output = _a.output, referencedModules = _a.referencedModules;
        var moduleName = host.pathToModuleName('', fileName);
        modulesManifest.addModule(fileName, moduleName);
        try {
            for (var referencedModules_1 = __values(referencedModules), referencedModules_1_1 = referencedModules_1.next(); !referencedModules_1_1.done; referencedModules_1_1 = referencedModules_1.next()) {
                var referenced = referencedModules_1_1.value;
                modulesManifest.addReferencedModule(fileName, referenced);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (referencedModules_1_1 && !referencedModules_1_1.done && (_b = referencedModules_1.return)) _b.call(referencedModules_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return output;
        var e_2, _b;
    }
    exports.convertCommonJsToGoogModuleIfNeeded = convertCommonJsToGoogModuleIfNeeded;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1cHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2VzNXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBR0gsaURBQXVEO0lBQ3ZELDJDQUFtQztJQUNuQyx5Q0FBcUM7SUF3QnJDOzs7T0FHRztJQUNILG9DQUEyQyxRQUFnQjtRQUN6RCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBSEQsZ0VBR0M7SUFFRDs7OztPQUlHO0lBQ0g7UUFBMkIsZ0NBQVE7UUEwQmpDLHNCQUFvQixJQUFzQixFQUFFLElBQW1CO1lBQS9ELFlBQ0Usa0JBQU0sSUFBSSxDQUFDLFNBQ1o7WUFGbUIsVUFBSSxHQUFKLElBQUksQ0FBa0I7WUF6QjFDOzs7Ozs7Ozs7O2VBVUc7WUFDSCxzQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1lBRXJDOzs7ZUFHRztZQUNILHFCQUFlLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7WUFFNUMsaUZBQWlGO1lBQ2pGLG9CQUFjLEdBQUcsS0FBSyxDQUFDO1lBRXZCLHlFQUF5RTtZQUN6RSxpQkFBVyxHQUFHLENBQUMsQ0FBQzs7UUFJaEIsQ0FBQztRQUVELDhCQUFPLEdBQVA7WUFDRSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEUsb0VBQW9FO1lBQ3BFLHFDQUFxQztZQUNyQyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixD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LENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBSkQsZ0NBSUM7SUFFRCw2Q0FDSSxJQUFzQixFQUFFLGVBQWdDLEVBQUUsUUFBZ0IsRUFDMUUsT0FBZTtRQUNqQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksb0JBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBQ0ssSUFBQSx3Q0FBaUUsRUFBaEUsa0JBQU0sRUFBRSx3Q0FBaUIsQ0FBd0M7UUFFeEUsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RCxlQUFlLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQzs7WUFDaEQsR0FBRyxDQUFDLENBQXFCLElBQUEsc0JBQUEsU0FBQSxpQkFBaUIsQ0FBQSxvREFBQTtnQkFBckMsSUFBTSxVQUFVLDhCQUFBO2dCQUNuQixlQUFlLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2FBQzNEOzs7Ozs7Ozs7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDOztJQUNoQixDQUFDO0lBZkQsa0ZBZUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TW9kdWxlc01hbmlmZXN0fSBmcm9tICcuL21vZHVsZXNfbWFuaWZlc3QnO1xuaW1wb3J0IHtnZXRJZGVudGlmaWVyVGV4dCwgUmV3cml0ZXJ9IGZyb20gJy4vcmV3cml0ZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAnLi90eXBlc2NyaXB0JztcbmltcG9ydCB7aXNEdHNGaWxlTmFtZX0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBFczVQcm9jZXNzb3JIb3N0IHtcbiAgLyoqXG4gICAqIFRha2VzIGEgY29udGV4dCAodGhlIGN1cnJlbnQgZmlsZSkgYW5kIHRoZSBwYXRoIG9mIHRoZSBmaWxlIHRvIGltcG9ydFxuICAgKiAgYW5kIGdlbmVyYXRlcyBhIGdvb2dtb2R1bGUgbW9kdWxlIG5hbWVcbiAgICovXG4gIHBhdGhUb01vZHVsZU5hbWUoY29udGV4dDogc3RyaW5nLCBpbXBvcnRQYXRoOiBzdHJpbmcpOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBJZiB3ZSBkbyBnb29nbW9kdWxlIHByb2Nlc3NpbmcsIHdlIHBvbHlmaWxsIG1vZHVsZS5pZCwgc2luY2UgdGhhdCdzXG4gICAqIHBhcnQgb2YgRVM2IG1vZHVsZXMuICBUaGlzIGZ1bmN0aW9uIGRldGVybWluZXMgd2hhdCB0aGUgbW9kdWxlLmlkIHdpbGwgYmVcbiAgICogZm9yIGVhY2ggZmlsZS5cbiAgICovXG4gIGZpbGVOYW1lVG9Nb2R1bGVJZChmaWxlTmFtZTogc3RyaW5nKTogc3RyaW5nO1xuICAvKiogV2hldGhlciB0byBjb252ZXJ0IENvbW1vbkpTIG1vZHVsZSBzeW50YXggdG8gYGdvb2cubW9kdWxlYCBDbG9zdXJlIGltcG9ydHMuICovXG4gIGdvb2dtb2R1bGU/OiBib29sZWFuO1xuICAvKiogV2hldGhlciB0aGUgZW1pdCB0YXJnZXRzIEVTNSBvciBFUzYrLiAqL1xuICBlczVNb2RlPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEFuIGFkZGl0aW9uYWwgcHJlbHVkZSB0byBpbnNlcnQgaW4gZnJvbnQgb2YgdGhlIGVtaXR0ZWQgY29kZSwgZS5nLiB0byBpbXBvcnQgYSBzaGFyZWQgbGlicmFyeS5cbiAgICovXG4gIHByZWx1ZGU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIG5hbWVzcGFjZSBwYXJ0IG9mIGEgZ29vZzogaW1wb3J0LCBvciByZXR1cm5zIG51bGwgaWYgdGhlIGdpdmVuXG4gKiBpbXBvcnQgaXMgbm90IGEgZ29vZzogaW1wb3J0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdEdvb2dOYW1lc3BhY2VJbXBvcnQodHNJbXBvcnQ6IHN0cmluZyk6IHN0cmluZ3xudWxsIHtcbiAgaWYgKHRzSW1wb3J0Lm1hdGNoKC9eZ29vZzovKSkgcmV0dXJuIHRzSW1wb3J0LnN1YnN0cmluZygnZ29vZzonLmxlbmd0aCk7XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEVTNVByb2Nlc3NvciBwb3N0cHJvY2Vzc2VzIFR5cGVTY3JpcHQgY29tcGlsYXRpb24gb3V0cHV0IEpTLCB0byByZXdyaXRlIGNvbW1vbmpzIHJlcXVpcmUoKXMgaW50b1xuICogZ29vZy5yZXF1aXJlKCkuIENvbnRyYXJ5IHRvIGl0cyBuYW1lIGl0IGhhbmRsZXMgY29udmVydGluZyB0aGUgbW9kdWxlcyBpbiBib3RoIEVTNSBhbmQgRVM2XG4gKiBvdXRwdXRzLlxuICovXG5jbGFzcyBFUzVQcm9jZXNzb3IgZXh0ZW5kcyBSZXdyaXRlciB7XG4gIC8qKlxuICAgKiBuYW1lc3BhY2VJbXBvcnRzIGNvbGxlY3RzIHRoZSB2YXJpYWJsZXMgZm9yIGltcG9ydGVkIGdvb2cubW9kdWxlcy5cbiAgICogSWYgdGhlIG9yaWdpbmFsIFRTIGlucHV0IGlzOlxuICAgKiAgIGltcG9ydCBmb28gZnJvbSAnZ29vZzpiYXInO1xuICAgKiB0aGVuIFRTIHByb2R1Y2VzOlxuICAgKiAgIHZhciBmb28gPSByZXF1aXJlKCdnb29nOmJhcicpO1xuICAgKiBhbmQgdGhpcyBjbGFzcyByZXdyaXRlcyBpdCB0bzpcbiAgICogICB2YXIgZm9vID0gcmVxdWlyZSgnZ29vZy5iYXInKTtcbiAgICogQWZ0ZXIgdGhpcyBzdGVwLCBuYW1lc3BhY2VJbXBvcnRzWydmb28nXSBpcyB0cnVlLlxuICAgKiAoVGhpcyBpcyB1c2VkIHRvIHJld3JpdGUgJ2Zvby5kZWZhdWx0JyBpbnRvIGp1c3QgJ2ZvbycuKVxuICAgKi9cbiAgbmFtZXNwYWNlSW1wb3J0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIC8qKlxuICAgKiBtb2R1bGVWYXJpYWJsZXMgbWFwcyBmcm9tIG1vZHVsZSBuYW1lcyB0byB0aGUgdmFyaWFibGVzIHRoZXkncmUgYXNzaWduZWQgdG8uXG4gICAqIENvbnRpbnVpbmcgdGhlIGFib3ZlIGV4YW1wbGUsIG1vZHVsZVZhcmlhYmxlc1snZ29vZy5iYXInXSA9ICdmb28nLlxuICAgKi9cbiAgbW9kdWxlVmFyaWFibGVzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuICAvKiogc3RyaXBwZWRTdHJpY3QgaXMgdHJ1ZSBvbmNlIHdlJ3ZlIHN0cmlwcGVkIGEgXCJ1c2Ugc3RyaWN0XCI7IGZyb20gdGhlIGlucHV0LiAqL1xuICBzdHJpcHBlZFN0cmljdCA9IGZhbHNlO1xuXG4gIC8qKiB1bnVzZWRJbmRleCBpcyB1c2VkIHRvIGdlbmVyYXRlIGZyZXNoIHN5bWJvbHMgZm9yIHVubmFtZWQgaW1wb3J0cy4gKi9cbiAgdW51c2VkSW5kZXggPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaG9zdDogRXM1UHJvY2Vzc29ySG9zdCwgZmlsZTogdHMuU291cmNlRmlsZSkge1xuICAgIHN1cGVyKGZpbGUpO1xuICB9XG5cbiAgcHJvY2VzcygpOiB7b3V0cHV0OiBzdHJpbmcsIHJlZmVyZW5jZWRNb2R1bGVzOiBzdHJpbmdbXX0ge1xuICAgIGNvbnN0IG1vZHVsZUlkID0gdGhpcy5ob3N0LmZpbGVOYW1lVG9Nb2R1bGVJZCh0aGlzLmZpbGUuZmlsZU5hbWUpO1xuICAgIC8vIFRPRE8oZXZhbm0pOiBvbmx5IGVtaXQgdGhlIGdvb2cubW9kdWxlICphZnRlciogdGhlIGZpcnN0IGNvbW1lbnQsXG4gICAgLy8gc28gdGhhdCBAc3VwcHJlc3Mgc3RhdGVtZW50cyB3b3JrLlxuICAgIGNvbnN0IG1vZHVsZU5hbWUgPSB0aGlzLmhvc3QucGF0aFRvTW9kdWxlTmFtZSgnJywgdGhpcy5maWxlLmZpbGVOYW1lKTtcbiAgICAvLyBOQjogTm8gbGluZWJyZWFrIGFmdGVyIG1vZHVsZSBjYWxsIHNvIHNvdXJjZW1hcHMgYXJlIG5vdCBvZmZzZXQuXG4gICAgdGhpcy5lbWl0KGBnb29nLm1vZHVsZSgnJHttb2R1bGVOYW1lfScpO2ApO1xuICAgIGlmICh0aGlzLmhvc3QucHJlbHVkZSkgdGhpcy5lbWl0KHRoaXMuaG9zdC5wcmVsdWRlKTtcbiAgICAvLyBBbGxvdyBjb2RlIHRvIHVzZSBgbW9kdWxlLmlkYCB0byBkaXNjb3ZlciBpdHMgbW9kdWxlIFVSTCwgZS5nLiB0byByZXNvbHZlXG4gICAgLy8gYSB0ZW1wbGF0ZSBVUkwgYWdhaW5zdC5cbiAgICAvLyBVc2VzICd2YXInLCBhcyB0aGlzIGNvZGUgaXMgaW5zZXJ0ZWQgaW4gRVM2IGFuZCBFUzUgbW9kZXMuXG4gICAgLy8gVGhlIGZvbGxvd2luZyBwYXR0ZXJuIGVuc3VyZXMgY2xvc3VyZSBkb2Vzbid0IHRocm93IGFuIGVycm9yIGluIGFkdmFuY2VkXG4gICAgLy8gb3B0aW1pemF0aW9ucyBtb2RlLlxuICAgIGlmICh0aGlzLmhvc3QuZXM1TW9kZSkge1xuICAgICAgdGhpcy5lbWl0KGB2YXIgbW9kdWxlID0gbW9kdWxlIHx8IHtpZDogJyR7bW9kdWxlSWR9J307YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSBgZXhwb3J0cyA9IHt9YCBzZXJ2ZXMgYXMgYSBkZWZhdWx0IGV4cG9ydCB0byBkaXNhYmxlIENsb3N1cmUgQ29tcGlsZXIncyBlcnJvciBjaGVja2luZ1xuICAgICAgLy8gZm9yIG11dGFibGUgZXhwb3J0cy4gVGhhdCdzIE9LIGJlY2F1c2UgVFMgY29tcGlsZXIgbWFrZXMgc3VyZSB0aGF0IGNvbnN1bWluZyBjb2RlIGFsd2F5c1xuICAgICAgLy8gYWNjZXNzZXMgZXhwb3J0cyB0aHJvdWdoIHRoZSBtb2R1bGUgb2JqZWN0LCBzbyBtdXRhYmxlIGV4cG9ydHMgd29yay5cbiAgICAgIC8vIEl0IGlzIG9ubHkgaW5zZXJ0ZWQgaW4gRVM2IGJlY2F1c2Ugd2Ugc3RyaXAgYC5kZWZhdWx0YCBhY2Nlc3NlcyBpbiBFUzUgbW9kZSwgd2hpY2ggYnJlYWtzXG4gICAgICAvLyB3aGVuIGFzc2lnbmluZyBhbiBgZXhwb3J0cyA9IHt9YCBvYmplY3QgYW5kIHRoZW4gbGF0ZXIgYWNjZXNzaW5nIGl0LlxuICAgICAgdGhpcy5lbWl0KGAgZXhwb3J0cyA9IHt9OyB2YXIgbW9kdWxlID0ge2lkOiAnJHttb2R1bGVJZH0nfTtgKTtcbiAgICB9XG5cbiAgICBsZXQgcG9zID0gMDtcbiAgICBmb3IgKGNvbnN0IHN0bXQgb2YgdGhpcy5maWxlLnN0YXRlbWVudHMpIHtcbiAgICAgIHRoaXMud3JpdGVSYW5nZSh0aGlzLmZpbGUsIHBvcywgc3RtdC5nZXRGdWxsU3RhcnQoKSk7XG4gICAgICB0aGlzLnZpc2l0VG9wTGV2ZWwoc3RtdCk7XG4gICAgICBwb3MgPSBzdG10LmdldEVuZCgpO1xuICAgIH1cbiAgICB0aGlzLndyaXRlUmFuZ2UodGhpcy5maWxlLCBwb3MsIHRoaXMuZmlsZS5nZXRFbmQoKSk7XG5cbiAgICBjb25zdCByZWZlcmVuY2VkTW9kdWxlcyA9IEFycmF5LmZyb20odGhpcy5tb2R1bGVWYXJpYWJsZXMua2V5cygpKTtcbiAgICAvLyBOb3RlOiBkb24ndCBzb3J0IHJlZmVyZW5jZWRNb2R1bGVzLCBhcyB0aGUga2V5cyBhcmUgaW4gdGhlIHNhbWUgb3JkZXJcbiAgICAvLyB0aGV5IG9jY3VyIGluIHRoZSBzb3VyY2UgZmlsZS5cbiAgICBjb25zdCB7b3V0cHV0fSA9IHRoaXMuZ2V0T3V0cHV0KCk7XG4gICAgcmV0dXJuIHtvdXRwdXQsIHJlZmVyZW5jZWRNb2R1bGVzfTtcbiAgfVxuXG4gIC8qKlxuICAgKiB2aXNpdFRvcExldmVsIHByb2Nlc3NlcyBhIHRvcC1sZXZlbCB0cy5Ob2RlIGFuZCBlbWl0cyBpdHMgY29udGVudHMuXG4gICAqXG4gICAqIEl0J3Mgc2VwYXJhdGUgZnJvbSB0aGUgbm9ybWFsIFJld3JpdGVyIHJlY3Vyc2l2ZSB0cmF2ZXJzYWxcbiAgICogYmVjYXVzZSBzb21lIHRvcC1sZXZlbCBzdGF0ZW1lbnRzIGFyZSBoYW5kbGVkIHNwZWNpYWxseS5cbiAgICovXG4gIHZpc2l0VG9wTGV2ZWwobm9kZTogdHMuTm9kZSkge1xuICAgIHN3aXRjaCAobm9kZS5raW5kKSB7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuRXhwcmVzc2lvblN0YXRlbWVudDpcbiAgICAgICAgLy8gQ2hlY2sgZm9yIFwidXNlIHN0cmljdFwiIGFuZCBza2lwIGl0IGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgaWYgKCF0aGlzLnN0cmlwcGVkU3RyaWN0ICYmIHRoaXMuaXNVc2VTdHJpY3Qobm9kZSkpIHtcbiAgICAgICAgICB0aGlzLmVtaXRDb21tZW50V2l0aG91dFN0YXRlbWVudEJvZHkobm9kZSk7XG4gICAgICAgICAgdGhpcy5zdHJpcHBlZFN0cmljdCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGZvcjpcbiAgICAgICAgLy8gLSBcInJlcXVpcmUoJ2ZvbycpO1wiIChhIHJlcXVpcmUgZm9yIGl0cyBzaWRlIGVmZmVjdHMpXG4gICAgICAgIC8vIC0gXCJfX2V4cG9ydChyZXF1aXJlKC4uLikpO1wiIChhbiBcImV4cG9ydCAqIGZyb20gLi4uXCIpXG4gICAgICAgIGlmICh0aGlzLmVtaXRSZXdyaXR0ZW5SZXF1aXJlcyhub2RlKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBmb3JcbiAgICAgICAgLy8gICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIC4uLik7XG4gICAgICAgIGlmICh0aGlzLmlzRXNNb2R1bGVQcm9wZXJ0eShub2RlIGFzIHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQpKSB7XG4gICAgICAgICAgdGhpcy5lbWl0Q29tbWVudFdpdGhvdXRTdGF0ZW1lbnRCb2R5KG5vZGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlcndpc2UgZmFsbCB0aHJvdWdoIHRvIGRlZmF1bHQgcHJvY2Vzc2luZy5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuVmFyaWFibGVTdGF0ZW1lbnQ6XG4gICAgICAgIC8vIENoZWNrIGZvciBhIFwidmFyIHggPSByZXF1aXJlKCdmb28nKTtcIi5cbiAgICAgICAgaWYgKHRoaXMuZW1pdFJld3JpdHRlblJlcXVpcmVzKG5vZGUpKSByZXR1cm47XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMudmlzaXQobm9kZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIFR5cGVTY3JpcHQgQVNUIGF0dGFjaGVzIGNvbW1lbnRzIHRvIHN0YXRlbWVudCBub2Rlcywgc28gZXZlbiBpZiBhIG5vZGVcbiAgICogY29udGFpbnMgY29kZSB3ZSB3YW50IHRvIHNraXAgZW1pdHRpbmcsIHdlIG5lZWQgdG8gZW1pdCB0aGUgYXR0YWNoZWRcbiAgICogY29tbWVudChzKS5cbiAgICovXG4gIGVtaXRDb21tZW50V2l0aG91dFN0YXRlbWVudEJvZHkobm9kZTogdHMuTm9kZSkge1xuICAgIHRoaXMud3JpdGVMZWFkaW5nVHJpdmlhKG5vZGUpO1xuICB9XG5cbiAgLyoqIGlzVXNlU3RyaWN0IHJldHVybnMgdHJ1ZSBpZiBub2RlIGlzIGEgXCJ1c2Ugc3RyaWN0XCI7IHN0YXRlbWVudC4gKi9cbiAgaXNVc2VTdHJpY3Qobm9kZTogdHMuTm9kZSk6IGJvb2xlYW4ge1xuICAgIGlmIChub2RlLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuRXhwcmVzc2lvblN0YXRlbWVudCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGV4cHJTdG10ID0gbm9kZSBhcyB0cy5FeHByZXNzaW9uU3RhdGVtZW50O1xuICAgIGNvbnN0IGV4cHIgPSBleHByU3RtdC5leHByZXNzaW9uO1xuICAgIGlmIChleHByLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGxpdGVyYWwgPSBleHByIGFzIHRzLlN0cmluZ0xpdGVyYWw7XG4gICAgcmV0dXJuIGxpdGVyYWwudGV4dCA9PT0gJ3VzZSBzdHJpY3QnO1xuICB9XG5cbiAgLyoqXG4gICAqIGVtaXRSZXdyaXR0ZW5SZXF1aXJlcyByZXdyaXRlcyByZXF1aXJlKClzIGludG8gZ29vZy5yZXF1aXJlKCkgZXF1aXZhbGVudHMuXG4gICAqXG4gICAqIEByZXR1cm4gVHJ1ZSBpZiB0aGUgbm9kZSB3YXMgcmV3cml0dGVuLCBmYWxzZSBpZiBuZWVkcyBvcmRpbmFyeSBwcm9jZXNzaW5nLlxuICAgKi9cbiAgZW1pdFJld3JpdHRlblJlcXVpcmVzKG5vZGU6IHRzLk5vZGUpOiBib29sZWFuIHtcbiAgICAvLyBXZSdyZSBsb29raW5nIGZvciByZXF1aXJlcywgb2Ygb25lIG9mIHRoZSBmb3JtczpcbiAgICAvLyAtIFwidmFyIGltcG9ydE5hbWUgPSByZXF1aXJlKC4uLik7XCIuXG4gICAgLy8gLSBcInJlcXVpcmUoLi4uKTtcIi5cbiAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlU3RhdGVtZW50KSB7XG4gICAgICAvLyBJdCdzIHBvc3NpYmx5IG9mIHRoZSBmb3JtIFwidmFyIHggPSByZXF1aXJlKC4uLik7XCIuXG4gICAgICBjb25zdCB2YXJTdG10ID0gbm9kZSBhcyB0cy5WYXJpYWJsZVN0YXRlbWVudDtcblxuICAgICAgLy8gVmVyaWZ5IGl0J3MgYSBzaW5nbGUgZGVjbCAoYW5kIG5vdCBcInZhciB4ID0gLi4uLCB5ID0gLi4uO1wiKS5cbiAgICAgIGlmICh2YXJTdG10LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMubGVuZ3RoICE9PSAxKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBkZWNsID0gdmFyU3RtdC5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zWzBdO1xuXG4gICAgICAvLyBHcmFiIHRoZSB2YXJpYWJsZSBuYW1lIChhdm9pZGluZyB0aGluZ3MgbGlrZSBkZXN0cnVjdHVyaW5nIGJpbmRzKS5cbiAgICAgIGlmIChkZWNsLm5hbWUua2luZCAhPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCB2YXJOYW1lID0gZ2V0SWRlbnRpZmllclRleHQoZGVjbC5uYW1lIGFzIHRzLklkZW50aWZpZXIpO1xuICAgICAgaWYgKCFkZWNsLmluaXRpYWxpemVyIHx8IGRlY2wuaW5pdGlhbGl6ZXIua2luZCAhPT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbikgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgY2FsbCA9IGRlY2wuaW5pdGlhbGl6ZXIgYXMgdHMuQ2FsbEV4cHJlc3Npb247XG4gICAgICBjb25zdCByZXF1aXJlID0gdGhpcy5pc1JlcXVpcmUoY2FsbCk7XG4gICAgICBpZiAoIXJlcXVpcmUpIHJldHVybiBmYWxzZTtcbiAgICAgIHRoaXMud3JpdGVMZWFkaW5nVHJpdmlhKG5vZGUpO1xuICAgICAgdGhpcy5lbWl0R29vZ1JlcXVpcmUodmFyTmFtZSwgcmVxdWlyZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5FeHByZXNzaW9uU3RhdGVtZW50KSB7XG4gICAgICAvLyBJdCdzIHBvc3NpYmx5IG9mIHRoZSBmb3JtOlxuICAgICAgLy8gLSByZXF1aXJlKC4uLik7XG4gICAgICAvLyAtIF9fZXhwb3J0KHJlcXVpcmUoLi4uKSk7XG4gICAgICAvLyAtIHRzbGliXzEuX19leHBvcnRTdGFyKHJlcXVpcmUoLi4uKSk7XG4gICAgICAvLyBBbGwgYXJlIENhbGxFeHByZXNzaW9ucy5cbiAgICAgIGNvbnN0IGV4cHJTdG10ID0gbm9kZSBhcyB0cy5FeHByZXNzaW9uU3RhdGVtZW50O1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJTdG10LmV4cHJlc3Npb247XG4gICAgICBpZiAoZXhwci5raW5kICE9PSB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uKSByZXR1cm4gZmFsc2U7XG4gICAgICBsZXQgY2FsbCA9IGV4cHIgYXMgdHMuQ2FsbEV4cHJlc3Npb247XG5cbiAgICAgIGxldCByZXF1aXJlID0gdGhpcy5pc1JlcXVpcmUoY2FsbCk7XG4gICAgICBsZXQgaXNFeHBvcnQgPSBmYWxzZTtcbiAgICAgIGlmICghcmVxdWlyZSkge1xuICAgICAgICAvLyBJZiBpdCdzIGFuIF9fZXhwb3J0KHJlcXVpcmUoLi4uKSksIHdlIGVtaXQ6XG4gICAgICAgIC8vICAgdmFyIHggPSByZXF1aXJlKC4uLik7XG4gICAgICAgIC8vICAgX19leHBvcnQoeCk7XG4gICAgICAgIC8vIFRoaXMgZXh0cmEgdmFyaWFibGUgaXMgbmVjZXNzYXJ5IGluIGNhc2UgdGhlcmUncyBhIGxhdGVyIGltcG9ydCBvZiB0aGVcbiAgICAgICAgLy8gc2FtZSBtb2R1bGUgbmFtZS5cbiAgICAgICAgY29uc3QgaW5uZXJDYWxsID0gdGhpcy5pc0V4cG9ydFJlcXVpcmUoY2FsbCk7XG4gICAgICAgIGlmICghaW5uZXJDYWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlzRXhwb3J0ID0gdHJ1ZTtcbiAgICAgICAgY2FsbCA9IGlubmVyQ2FsbDsgIC8vIFVwZGF0ZSBjYWxsIHRvIHBvaW50IGF0IHRoZSByZXF1aXJlKCkgZXhwcmVzc2lvbi5cbiAgICAgICAgcmVxdWlyZSA9IHRoaXMuaXNSZXF1aXJlKGNhbGwpO1xuICAgICAgfVxuICAgICAgaWYgKCFyZXF1aXJlKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHRoaXMud3JpdGVMZWFkaW5nVHJpdmlhKG5vZGUpO1xuICAgICAgY29uc3QgdmFyTmFtZSA9IHRoaXMuZW1pdEdvb2dSZXF1aXJlKG51bGwsIHJlcXVpcmUpO1xuXG4gICAgICBpZiAoaXNFeHBvcnQpIHtcbiAgICAgICAgLy8gbm9kZSBpcyBhIHN0YXRlbWVudCBjb250YWluaW5nIGEgcmVxdWlyZSgpIGluIGl0LCB3aGlsZVxuICAgICAgICAvLyByZXF1aXJlQ2FsbCBpcyB0aGF0IGNhbGwuICBXZSByZXBsYWNlIHRoZSByZXF1aXJlKCkgY2FsbFxuICAgICAgICAvLyB3aXRoIHRoZSB2YXJpYWJsZSB3ZSBlbWl0dGVkLlxuICAgICAgICBjb25zdCBmdWxsU3RhdGVtZW50ID0gbm9kZS5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVDYWxsID0gY2FsbC5nZXRUZXh0KCk7XG4gICAgICAgIHRoaXMuZW1pdChmdWxsU3RhdGVtZW50LnJlcGxhY2UocmVxdWlyZUNhbGwsIHZhck5hbWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJdCdzIHNvbWUgb3RoZXIgdHlwZSBvZiBzdGF0ZW1lbnQuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIGEgZ29vZy5yZXF1aXJlKCkgc3RhdGVtZW50IGZvciBhIGdpdmVuIHZhcmlhYmxlIG5hbWUgYW5kIFR5cGVTY3JpcHQgaW1wb3J0LlxuICAgKlxuICAgKiBFLmcuIGZyb206XG4gICAqICAgdmFyIHZhck5hbWUgPSByZXF1aXJlKCd0c0ltcG9ydCcpO1xuICAgKiBwcm9kdWNlczpcbiAgICogICB2YXIgdmFyTmFtZSA9IGdvb2cucmVxdWlyZSgnZ29vZy5tb2R1bGUubmFtZScpO1xuICAgKlxuICAgKiBJZiB0aGUgaW5wdXQgdmFyTmFtZSBpcyBudWxsLCBnZW5lcmF0ZXMgYSBuZXcgdmFyaWFibGUgbmFtZSBpZiBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIHZhcmlhYmxlIG5hbWUgZm9yIHRoZSBpbXBvcnRlZCBtb2R1bGUsIHJldXNpbmcgYSBwcmV2aW91cyBpbXBvcnQgaWYgb25lXG4gICAqICAgIGlzIGF2YWlsYWJsZS5cbiAgICovXG4gIGVtaXRHb29nUmVxdWlyZSh2YXJOYW1lOiBzdHJpbmd8bnVsbCwgdHNJbXBvcnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IG1vZE5hbWU6IHN0cmluZztcbiAgICBsZXQgaXNOYW1lc3BhY2VJbXBvcnQgPSBmYWxzZTtcbiAgICBjb25zdCBuc0ltcG9ydCA9IGV4dHJhY3RHb29nTmFtZXNwYWNlSW1wb3J0KHRzSW1wb3J0KTtcbiAgICBpZiAobnNJbXBvcnQgIT09IG51bGwpIHtcbiAgICAgIC8vIFRoaXMgaXMgYSBuYW1lc3BhY2UgaW1wb3J0LCBvZiB0aGUgZm9ybSBcImdvb2c6Zm9vLmJhclwiLlxuICAgICAgLy8gRml4IGl0IHRvIGp1c3QgXCJmb28uYmFyXCIuXG4gICAgICBtb2ROYW1lID0gbnNJbXBvcnQ7XG4gICAgICBpc05hbWVzcGFjZUltcG9ydCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZE5hbWUgPSB0aGlzLmhvc3QucGF0aFRvTW9kdWxlTmFtZSh0aGlzLmZpbGUuZmlsZU5hbWUsIHRzSW1wb3J0KTtcbiAgICB9XG5cbiAgICBpZiAoIXZhck5hbWUpIHtcbiAgICAgIGNvbnN0IG12ID0gdGhpcy5tb2R1bGVWYXJpYWJsZXMuZ2V0KG1vZE5hbWUpO1xuICAgICAgaWYgKG12KSB7XG4gICAgICAgIC8vIENhbGxlciBkaWRuJ3QgcmVxdWVzdCBhIHNwZWNpZmljIHZhcmlhYmxlIG5hbWUgYW5kIHdlJ3ZlIGFscmVhZHlcbiAgICAgICAgLy8gaW1wb3J0ZWQgdGhlIG1vZHVsZSwgc28ganVzdCByZXR1cm4gdGhlIG5hbWUgd2UgYWxyZWFkeSBoYXZlIGZvciB0aGlzIG1vZHVsZS5cbiAgICAgICAgcmV0dXJuIG12O1xuICAgICAgfVxuXG4gICAgICAvLyBOb3RlOiB3ZSBhbHdheXMgaW50cm9kdWNlIGEgdmFyaWFibGUgZm9yIGFueSBpbXBvcnQsIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlclxuICAgICAgLy8gdGhlIGNhbGxlciByZXF1ZXN0ZWQgb25lLiAgVGhpcyBhdm9pZHMgYSBDbG9zdXJlIGVycm9yLlxuICAgICAgdmFyTmFtZSA9IHRoaXMuZ2VuZXJhdGVGcmVzaFZhcmlhYmxlTmFtZSgpO1xuICAgIH1cblxuICAgIGlmIChpc05hbWVzcGFjZUltcG9ydCkgdGhpcy5uYW1lc3BhY2VJbXBvcnRzLmFkZCh2YXJOYW1lKTtcbiAgICBpZiAodGhpcy5tb2R1bGVWYXJpYWJsZXMuaGFzKG1vZE5hbWUpKSB7XG4gICAgICB0aGlzLmVtaXQoYHZhciAke3Zhck5hbWV9ID0gJHt0aGlzLm1vZHVsZVZhcmlhYmxlcy5nZXQobW9kTmFtZSl9O2ApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtaXQoYHZhciAke3Zhck5hbWV9ID0gZ29vZy5yZXF1aXJlKCcke21vZE5hbWV9Jyk7YCk7XG4gICAgICB0aGlzLm1vZHVsZVZhcmlhYmxlcy5zZXQobW9kTmFtZSwgdmFyTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiB2YXJOYW1lO1xuICB9XG4gIC8vIHdvcmthcm91bmQgZm9yIHN5bnRheCBoaWdobGlnaHRpbmcgYnVnIGluIFN1YmxpbWU6IGBcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RyaW5nIGFyZ3VtZW50IGlmIGNhbGwgaXMgb2YgdGhlIGZvcm1cbiAgICogICByZXF1aXJlKCdmb28nKVxuICAgKi9cbiAgaXNSZXF1aXJlKGNhbGw6IHRzLkNhbGxFeHByZXNzaW9uKTogc3RyaW5nfG51bGwge1xuICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBjYWxsIGlzIGEgY2FsbCB0byByZXF1aXJlKC4uLikuXG4gICAgaWYgKGNhbGwuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGlkZW50ID0gY2FsbC5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXI7XG4gICAgaWYgKGdldElkZW50aWZpZXJUZXh0KGlkZW50KSAhPT0gJ3JlcXVpcmUnKSByZXR1cm4gbnVsbDtcblxuICAgIC8vIFZlcmlmeSB0aGUgY2FsbCB0YWtlcyBhIHNpbmdsZSBzdHJpbmcgYXJndW1lbnQgYW5kIGdyYWIgaXQuXG4gICAgaWYgKGNhbGwuYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgYXJnID0gY2FsbC5hcmd1bWVudHNbMF07XG4gICAgaWYgKGFyZy5raW5kICE9PSB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpIHJldHVybiBudWxsO1xuICAgIHJldHVybiAoYXJnIGFzIHRzLlN0cmluZ0xpdGVyYWwpLnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcmVxdWlyZSgpIGNhbGwgbm9kZSBpZiB0aGUgb3V0ZXIgY2FsbCBpcyBvZiB0aGUgZm9ybXM6XG4gICAqIC0gX19leHBvcnQocmVxdWlyZSgnZm9vJykpXG4gICAqIC0gdHNsaWJfMS5fX2V4cG9ydFN0YXIocmVxdWlyZSgnZm9vJyksIGJhcilcbiAgICovXG4gIGlzRXhwb3J0UmVxdWlyZShjYWxsOiB0cy5DYWxsRXhwcmVzc2lvbik6IHRzLkNhbGxFeHByZXNzaW9ufG51bGwge1xuICAgIHN3aXRjaCAoY2FsbC5leHByZXNzaW9uLmtpbmQpIHtcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5JZGVudGlmaWVyOlxuICAgICAgICBjb25zdCBpZGVudCA9IGNhbGwuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyO1xuICAgICAgICAvLyBUU18yNF9DT01QQVQ6IGFjY2VwdCB0aHJlZSBsZWFkaW5nIHVuZGVyc2NvcmVzXG4gICAgICAgIGlmIChpZGVudC50ZXh0ICE9PSAnX19leHBvcnQnICYmIGlkZW50LnRleHQgIT09ICdfX19leHBvcnQnKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uOlxuICAgICAgICBjb25zdCBwcm9wQWNjZXNzID0gY2FsbC5leHByZXNzaW9uIGFzIHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbjtcbiAgICAgICAgLy8gVFNfMjRfQ09NUEFUOiBhY2NlcHQgdGhyZWUgbGVhZGluZyB1bmRlcnNjb3Jlc1xuICAgICAgICBpZiAocHJvcEFjY2Vzcy5uYW1lLnRleHQgIT09ICdfX2V4cG9ydFN0YXInICYmIHByb3BBY2Nlc3MubmFtZS50ZXh0ICE9PSAnX19fZXhwb3J0U3RhcicpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIFZlcmlmeSB0aGUgY2FsbCB0YWtlcyBhdCBsZWFzdCBvbmUgYXJndW1lbnQgYW5kIGNoZWNrIGl0LlxuICAgIGlmIChjYWxsLmFyZ3VtZW50cy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBhcmcgPSBjYWxsLmFyZ3VtZW50c1swXTtcbiAgICBpZiAoYXJnLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb24pIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGlubmVyQ2FsbCA9IGFyZyBhcyB0cy5DYWxsRXhwcmVzc2lvbjtcbiAgICBpZiAoIXRoaXMuaXNSZXF1aXJlKGlubmVyQ2FsbCkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBpbm5lckNhbGw7XG4gIH1cblxuICBpc0VzTW9kdWxlUHJvcGVydHkoZXhwcjogdHMuRXhwcmVzc2lvblN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIC8vIFdlJ3JlIG1hdGNoaW5nIHRoZSBleHBsaWNpdCBzb3VyY2UgdGV4dCBnZW5lcmF0ZWQgYnkgdGhlIFRTIGNvbXBpbGVyLlxuICAgIHJldHVybiBleHByLmdldFRleHQoKSA9PT0gJ09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTsnO1xuICB9XG5cbiAgLyoqXG4gICAqIG1heWJlUHJvY2VzcyBpcyBjYWxsZWQgZHVyaW5nIHRoZSByZWN1cnNpdmUgdHJhdmVyc2FsIG9mIHRoZSBwcm9ncmFtJ3MgQVNULlxuICAgKlxuICAgKiBAcmV0dXJuIFRydWUgaWYgdGhlIG5vZGUgd2FzIHByb2Nlc3NlZC9lbWl0dGVkLCBmYWxzZSBpZiBpdCBzaG91bGQgYmUgZW1pdHRlZCBhcyBpcy5cbiAgICovXG4gIHByb3RlY3RlZCBtYXliZVByb2Nlc3Mobm9kZTogdHMuTm9kZSk6IGJvb2xlYW4ge1xuICAgIHN3aXRjaCAobm9kZS5raW5kKSB7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uOlxuICAgICAgICBjb25zdCBwcm9wQWNjZXNzID0gbm9kZSBhcyB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb247XG4gICAgICAgIC8vIFdlJ3JlIGxvb2tpbmcgZm9yIGFuIGV4cHJlc3Npb24gb2YgdGhlIGZvcm06XG4gICAgICAgIC8vICAgbW9kdWxlX25hbWVfdmFyLmRlZmF1bHRcbiAgICAgICAgaWYgKGdldElkZW50aWZpZXJUZXh0KHByb3BBY2Nlc3MubmFtZSkgIT09ICdkZWZhdWx0JykgYnJlYWs7XG4gICAgICAgIGlmIChwcm9wQWNjZXNzLmV4cHJlc3Npb24ua2luZCAhPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSBicmVhaztcbiAgICAgICAgY29uc3QgbGhzID0gZ2V0SWRlbnRpZmllclRleHQocHJvcEFjY2Vzcy5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXIpO1xuICAgICAgICBpZiAoIXRoaXMubmFtZXNwYWNlSW1wb3J0cy5oYXMobGhzKSkgYnJlYWs7XG4gICAgICAgIC8vIEVtaXQgdGhlIHNhbWUgZXhwcmVzc2lvbiwgd2l0aCBzcGFjZXMgdG8gcmVwbGFjZSB0aGUgXCIuZGVmYXVsdFwiIHBhcnRcbiAgICAgICAgLy8gc28gdGhhdCBzb3VyY2UgbWFwcyBzdGlsbCBsaW5lIHVwLlxuICAgICAgICB0aGlzLndyaXRlTGVhZGluZ1RyaXZpYShub2RlKTtcbiAgICAgICAgdGhpcy5lbWl0KGAke2xoc30gICAgICAgIGApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogR2VuZXJhdGVzIGEgbmV3IHZhcmlhYmxlIG5hbWUgaW5zaWRlIHRoZSB0c2lja2xlXyBuYW1lc3BhY2UuICovXG4gIGdlbmVyYXRlRnJlc2hWYXJpYWJsZU5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYHRzaWNrbGVfbW9kdWxlXyR7dGhpcy51bnVzZWRJbmRleCsrfV9gO1xuICB9XG59XG5cbi8qKlxuICogQ29udmVydHMgVHlwZVNjcmlwdCdzIEpTK0NvbW1vbkpTIG91dHB1dCB0byBDbG9zdXJlIGdvb2cubW9kdWxlIGV0Yy5cbiAqIEZvciB1c2UgYXMgYSBwb3N0cHJvY2Vzc2luZyBzdGVwICphZnRlciogVHlwZVNjcmlwdCBlbWl0cyBKYXZhU2NyaXB0LlxuICpcbiAqIEBwYXJhbSBmaWxlTmFtZSBUaGUgc291cmNlIGZpbGUgbmFtZS5cbiAqIEBwYXJhbSBtb2R1bGVJZCBUaGUgXCJtb2R1bGUgaWRcIiwgYSBtb2R1bGUtaWRlbnRpZnlpbmcgc3RyaW5nIHRoYXQgaXNcbiAqICAgICB0aGUgdmFsdWUgbW9kdWxlLmlkIGluIHRoZSBzY29wZSBvZiB0aGUgbW9kdWxlLlxuICogQHBhcmFtIHBhdGhUb01vZHVsZU5hbWUgQSBmdW5jdGlvbiB0aGF0IG1hcHMgYSBmaWxlc3lzdGVtIC50cyBwYXRoIHRvIGFcbiAqICAgICBDbG9zdXJlIG1vZHVsZSBuYW1lLCBhcyBmb3VuZCBpbiBhIGdvb2cucmVxdWlyZSgnLi4uJykgc3RhdGVtZW50LlxuICogICAgIFRoZSBjb250ZXh0IHBhcmFtZXRlciBpcyB0aGUgcmVmZXJlbmNpbmcgZmlsZSwgdXNlZCBmb3IgcmVzb2x2aW5nXG4gKiAgICAgaW1wb3J0cyB3aXRoIHJlbGF0aXZlIHBhdGhzIGxpa2UgXCJpbXBvcnQgKiBhcyBmb28gZnJvbSAnLi4vZm9vJztcIi5cbiAqIEBwYXJhbSBwcmVsdWRlIEFuIGFkZGl0aW9uYWwgcHJlbHVkZSB0byBpbnNlcnQgYWZ0ZXIgdGhlIGBnb29nLm1vZHVsZWAgY2FsbCxcbiAqICAgICBlLmcuIHdpdGggYWRkaXRpb25hbCBpbXBvcnRzIG9yIHJlcXVpcmVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0VTNShob3N0OiBFczVQcm9jZXNzb3JIb3N0LCBmaWxlTmFtZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOlxuICAgIHtvdXRwdXQ6IHN0cmluZywgcmVmZXJlbmNlZE1vZHVsZXM6IHN0cmluZ1tdfSB7XG4gIGNvbnN0IGZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKGZpbGVOYW1lLCBjb250ZW50LCB0cy5TY3JpcHRUYXJnZXQuRVM1LCB0cnVlKTtcbiAgcmV0dXJuIG5ldyBFUzVQcm9jZXNzb3IoaG9zdCwgZmlsZSkucHJvY2VzcygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydENvbW1vbkpzVG9Hb29nTW9kdWxlSWZOZWVkZWQoXG4gICAgaG9zdDogRXM1UHJvY2Vzc29ySG9zdCwgbW9kdWxlc01hbmlmZXN0OiBNb2R1bGVzTWFuaWZlc3QsIGZpbGVOYW1lOiBzdHJpbmcsXG4gICAgY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKCFob3N0Lmdvb2dtb2R1bGUgfHwgaXNEdHNGaWxlTmFtZShmaWxlTmFtZSkpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBjb25zdCB7b3V0cHV0LCByZWZlcmVuY2VkTW9kdWxlc30gPSBwcm9jZXNzRVM1KGhvc3QsIGZpbGVOYW1lLCBjb250ZW50KTtcblxuICBjb25zdCBtb2R1bGVOYW1lID0gaG9zdC5wYXRoVG9Nb2R1bGVOYW1lKCcnLCBmaWxlTmFtZSk7XG4gIG1vZHVsZXNNYW5pZmVzdC5hZGRNb2R1bGUoZmlsZU5hbWUsIG1vZHVsZU5hbWUpO1xuICBmb3IgKGNvbnN0IHJlZmVyZW5jZWQgb2YgcmVmZXJlbmNlZE1vZHVsZXMpIHtcbiAgICBtb2R1bGVzTWFuaWZlc3QuYWRkUmVmZXJlbmNlZE1vZHVsZShmaWxlTmFtZSwgcmVmZXJlbmNlZCk7XG4gIH1cblxuICByZXR1cm4gb3V0cHV0O1xufVxuIl19