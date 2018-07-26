/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
        define("tsickle/src/rewriter", ["require", "exports", "tsickle/src/source_map_utils", "tsickle/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var source_map_utils_1 = require("tsickle/src/source_map_utils");
    var ts = require("tsickle/src/typescript");
    /**
     * A Rewriter manages iterating through a ts.SourceFile, copying input
     * to output while letting the subclass potentially alter some nodes
     * along the way by implementing maybeProcess().
     */
    var Rewriter = /** @class */ (function () {
        function Rewriter(file, sourceMapper) {
            if (sourceMapper === void 0) { sourceMapper = source_map_utils_1.NOOP_SOURCE_MAPPER; }
            this.file = file;
            this.sourceMapper = sourceMapper;
            this.output = [];
            /** Errors found while examining the code. */
            this.diagnostics = [];
            /** Current position in the output. */
            this.position = { line: 0, column: 0, position: 0 };
            /**
             * The current level of recursion through TypeScript Nodes.  Used in formatting internal debug
             * print statements.
             */
            this.indent = 0;
            /**
             * Skip emitting any code before the given offset. E.g. used to avoid emitting @fileoverview
             * comments twice.
             */
            this.skipCommentsUpToOffset = -1;
        }
        Rewriter.prototype.getOutput = function () {
            if (this.indent !== 0) {
                throw new Error('visit() failed to track nesting');
            }
            return {
                output: this.output.join(''),
                diagnostics: this.diagnostics,
            };
        };
        /**
         * visit traverses a Node, recursively writing all nodes not handled by this.maybeProcess.
         */
        Rewriter.prototype.visit = function (node) {
            // this.logWithIndent('node: ' + ts.SyntaxKind[node.kind]);
            this.indent++;
            try {
                if (!this.maybeProcess(node)) {
                    this.writeNode(node);
                }
            }
            catch (e) {
                if (!e.message)
                    e.message = 'Unhandled error in tsickle';
                e.message += "\n at " + ts.SyntaxKind[node.kind] + " in " + this.file.fileName + ":";
                var _a = this.file.getLineAndCharacterOfPosition(node.getStart()), line = _a.line, character = _a.character;
                e.message += line + 1 + ":" + (character + 1);
                throw e;
            }
            this.indent--;
        };
        /**
         * maybeProcess lets subclasses optionally processes a node.
         *
         * @return True if the node has been handled and doesn't need to be traversed;
         *    false to have the node written and its children recursively visited.
         */
        Rewriter.prototype.maybeProcess = function (node) {
            return false;
        };
        /** writeNode writes a ts.Node, calling this.visit() on its children. */
        Rewriter.prototype.writeNode = function (node, skipComments, newLineIfCommentsStripped) {
            if (skipComments === void 0) { skipComments = false; }
            if (newLineIfCommentsStripped === void 0) { newLineIfCommentsStripped = true; }
            var pos = node.getFullStart();
            if (skipComments) {
                // To skip comments, we skip all whitespace/comments preceding
                // the node.  But if there was anything skipped we should emit
                // a newline in its place so that the node remains separated
                // from the previous node.  TODO: don't skip anything here if
                // there wasn't any comment.
                if (newLineIfCommentsStripped && node.getFullStart() < node.getStart()) {
                    this.emit('\n');
                }
                pos = node.getStart();
            }
            this.writeNodeFrom(node, pos);
        };
        Rewriter.prototype.writeNodeFrom = function (node, pos, end) {
            var _this = this;
            if (end === void 0) { end = node.getEnd(); }
            if (end <= this.skipCommentsUpToOffset) {
                return;
            }
            var oldSkipCommentsUpToOffset = this.skipCommentsUpToOffset;
            this.skipCommentsUpToOffset = Math.max(this.skipCommentsUpToOffset, pos);
            ts.forEachChild(node, function (child) {
                _this.writeRange(node, pos, child.getFullStart());
                _this.visit(child);
                pos = child.getEnd();
            });
            this.writeRange(node, pos, end);
            this.skipCommentsUpToOffset = oldSkipCommentsUpToOffset;
        };
        Rewriter.prototype.writeLeadingTrivia = function (node) {
            this.writeRange(node, node.getFullStart(), node.getStart());
        };
        Rewriter.prototype.addSourceMapping = function (node) {
            this.writeRange(node, node.getEnd(), node.getEnd());
        };
        /**
         * Write a span of the input file as expressed by absolute offsets.
         * These offsets are found in attributes like node.getFullStart() and
         * node.getEnd().
         */
        Rewriter.prototype.writeRange = function (node, from, to) {
            var fullStart = node.getFullStart();
            var textStart = node.getStart();
            if (from >= fullStart && from < textStart) {
                from = Math.max(from, this.skipCommentsUpToOffset);
            }
            // Add a source mapping. writeRange(from, to) always corresponds to
            // original source code, so add a mapping at the current location that
            // points back to the location at `from`. The additional code generated
            // by tsickle will then be considered part of the last mapped code
            // section preceding it. That's arguably incorrect (e.g. for the fake
            // methods defining properties), but is good enough for stack traces.
            var pos = this.file.getLineAndCharacterOfPosition(from);
            this.sourceMapper.addMapping(node, { line: pos.line, column: pos.character, position: from }, this.position, to - from);
            // getSourceFile().getText() is wrong here because it has the text of
            // the SourceFile node of the AST, which doesn't contain the comments
            // preceding that node.  Semantically these ranges are just offsets
            // into the original source file text, so slice from that.
            var text = this.file.text.slice(from, to);
            if (text) {
                this.emit(text);
            }
        };
        Rewriter.prototype.emit = function (str) {
            this.output.push(str);
            try {
                for (var str_1 = __values(str), str_1_1 = str_1.next(); !str_1_1.done; str_1_1 = str_1.next()) {
                    var c = str_1_1.value;
                    this.position.column++;
                    if (c === '\n') {
                        this.position.line++;
                        this.position.column = 0;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (str_1_1 && !str_1_1.done && (_a = str_1.return)) _a.call(str_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.position.position += str.length;
            var e_1, _a;
        };
        /** Removes comment metacharacters from a string, to make it safe to embed in a comment. */
        Rewriter.prototype.escapeForComment = function (str) {
            return str.replace(/\/\*/g, '__').replace(/\*\//g, '__');
        };
        /* tslint:disable: no-unused-variable */
        Rewriter.prototype.logWithIndent = function (message) {
            /* tslint:enable: no-unused-variable */
            var prefix = new Array(this.indent + 1).join('| ');
            console.log(prefix + message);
        };
        /**
         * Produces a compiler error that references the Node's kind.  This is useful for the "else"
         * branch of code that is attempting to handle all possible input Node types, to ensure all cases
         * covered.
         */
        Rewriter.prototype.errorUnimplementedKind = function (node, where) {
            this.error(node, ts.SyntaxKind[node.kind] + " not implemented in " + where);
        };
        Rewriter.prototype.error = function (node, messageText) {
            this.diagnostics.push({
                file: this.file,
                start: node.getStart(),
                length: node.getEnd() - node.getStart(),
                messageText: messageText,
                category: ts.DiagnosticCategory.Error,
                code: 0,
            });
        };
        return Rewriter;
    }());
    exports.Rewriter = Rewriter;
    /** Returns the string contents of a ts.Identifier. */
    function getIdentifierText(identifier) {
        // NOTE: the 'text' property on an Identifier may be escaped if it starts
        // with '__', so just use getText().
        return identifier.getText();
    }
    exports.getIdentifierText = getIdentifierText;
    /** Returns a dot-joined qualified name (foo.bar.Baz). */
    function getEntityNameText(name) {
        if (ts.isIdentifier(name)) {
            return getIdentifierText(name);
        }
        return getEntityNameText(name.left) + '.' + getIdentifierText(name.right);
    }
    exports.getEntityNameText = getEntityNameText;
    /**
     * Converts an escaped TypeScript name into the original source name.
     * Prefer getIdentifierText() instead if possible.
     */
    function unescapeName(name) {
        // See the private function unescapeIdentifier in TypeScript's utilities.ts.
        if (name.match(/^___/))
            return name.substr(1);
        return name;
    }
    exports.unescapeName = unescapeName;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV3cml0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcmV3cml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUgsaUVBQW9GO0lBQ3BGLDJDQUFtQztJQUVuQzs7OztPQUlHO0lBQ0g7UUFpQkUsa0JBQW1CLElBQW1CLEVBQVUsWUFBK0M7WUFBL0MsNkJBQUEsRUFBQSxlQUE2QixxQ0FBa0I7WUFBNUUsU0FBSSxHQUFKLElBQUksQ0FBZTtZQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFtQztZQWhCdkYsV0FBTSxHQUFhLEVBQUUsQ0FBQztZQUM5Qiw2Q0FBNkM7WUFDbkMsZ0JBQVcsR0FBb0IsRUFBRSxDQUFDO1lBQzVDLHNDQUFzQztZQUM5QixhQUFRLEdBQW1CLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUMsQ0FBQztZQUNyRTs7O2VBR0c7WUFDSyxXQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ25COzs7ZUFHRztZQUNLLDJCQUFzQixHQUFHLENBQUMsQ0FBQyxDQUFDO1FBR3BDLENBQUM7UUFFRCw0QkFBUyxHQUFUO1lBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7WUFDckQsQ0FBQztZQUNELE1BQU0sQ0FBQztnQkFDTCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUM1QixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7YUFDOUIsQ0FBQztRQUNKLENBQUM7UUFFRDs7V0FFRztRQUNILHdCQUFLLEdBQUwsVUFBTSxJQUFhO1lBQ2pCLDJEQUEyRDtZQUMzRCxJQUFJLENBQUMsTUFBTSxFQUFF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Q0FBQztZQUMxQixNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBTEQsOENBS0M7SUFFRDs7O09BR0c7SUFDSCxzQkFBNkIsSUFBWTtRQUN2Qyw0RUFBNEU7UUFDNUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBSkQsb0NBSUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Tk9PUF9TT1VSQ0VfTUFQUEVSLCBTb3VyY2VNYXBwZXIsIFNvdXJjZVBvc2l0aW9ufSBmcm9tICcuL3NvdXJjZV9tYXBfdXRpbHMnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAnLi90eXBlc2NyaXB0JztcblxuLyoqXG4gKiBBIFJld3JpdGVyIG1hbmFnZXMgaXRlcmF0aW5nIHRocm91Z2ggYSB0cy5Tb3VyY2VGaWxlLCBjb3B5aW5nIGlucHV0XG4gKiB0byBvdXRwdXQgd2hpbGUgbGV0dGluZyB0aGUgc3ViY2xhc3MgcG90ZW50aWFsbHkgYWx0ZXIgc29tZSBub2Rlc1xuICogYWxvbmcgdGhlIHdheSBieSBpbXBsZW1lbnRpbmcgbWF5YmVQcm9jZXNzKCkuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZXdyaXRlciB7XG4gIHByaXZhdGUgb3V0cHV0OiBzdHJpbmdbXSA9IFtdO1xuICAvKiogRXJyb3JzIGZvdW5kIHdoaWxlIGV4YW1pbmluZyB0aGUgY29kZS4gKi9cbiAgcHJvdGVjdGVkIGRpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW10gPSBbXTtcbiAgLyoqIEN1cnJlbnQgcG9zaXRpb24gaW4gdGhlIG91dHB1dC4gKi9cbiAgcHJpdmF0ZSBwb3NpdGlvbjogU291cmNlUG9zaXRpb24gPSB7bGluZTogMCwgY29sdW1uOiAwLCBwb3NpdGlvbjogMH07XG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCBsZXZlbCBvZiByZWN1cnNpb24gdGhyb3VnaCBUeXBlU2NyaXB0IE5vZGVzLiAgVXNlZCBpbiBmb3JtYXR0aW5nIGludGVybmFsIGRlYnVnXG4gICAqIHByaW50IHN0YXRlbWVudHMuXG4gICAqL1xuICBwcml2YXRlIGluZGVudCA9IDA7XG4gIC8qKlxuICAgKiBTa2lwIGVtaXR0aW5nIGFueSBjb2RlIGJlZm9yZSB0aGUgZ2l2ZW4gb2Zmc2V0LiBFLmcuIHVzZWQgdG8gYXZvaWQgZW1pdHRpbmcgQGZpbGVvdmVydmlld1xuICAgKiBjb21tZW50cyB0d2ljZS5cbiAgICovXG4gIHByaXZhdGUgc2tpcENvbW1lbnRzVXBUb09mZnNldCA9IC0xO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBmaWxlOiB0cy5Tb3VyY2VGaWxlLCBwcml2YXRlIHNvdXJjZU1hcHBlcjogU291cmNlTWFwcGVyID0gTk9PUF9TT1VSQ0VfTUFQUEVSKSB7XG4gIH1cblxuICBnZXRPdXRwdXQoKToge291dHB1dDogc3RyaW5nLCBkaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdfSB7XG4gICAgaWYgKHRoaXMuaW5kZW50ICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Zpc2l0KCkgZmFpbGVkIHRvIHRyYWNrIG5lc3RpbmcnKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG91dHB1dDogdGhpcy5vdXRwdXQuam9pbignJyksXG4gICAgICBkaWFnbm9zdGljczogdGhpcy5kaWFnbm9zdGljcyxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIHZpc2l0IHRyYXZlcnNlcyBhIE5vZGUsIHJlY3Vyc2l2ZWx5IHdyaXRpbmcgYWxsIG5vZGVzIG5vdCBoYW5kbGVkIGJ5IHRoaXMubWF5YmVQcm9jZXNzLlxuICAgKi9cbiAgdmlzaXQobm9kZTogdHMuTm9kZSkge1xuICAgIC8vIHRoaXMubG9nV2l0aEluZGVudCgnbm9kZTogJyArIHRzLlN5bnRheEtpbmRbbm9kZS5raW5kXSk7XG4gICAgdGhpcy5pbmRlbnQrKztcbiAgICB0cnkge1xuICAgICAgaWYgKCF0aGlzLm1heWJlUHJvY2Vzcyhub2RlKSkge1xuICAgICAgICB0aGlzLndyaXRlTm9kZShub2RlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoIWUubWVzc2FnZSkgZS5tZXNzYWdlID0gJ1VuaGFuZGxlZCBlcnJvciBpbiB0c2lja2xlJztcbiAgICAgIGUubWVzc2FnZSArPSBgXFxuIGF0ICR7dHMuU3ludGF4S2luZFtub2RlLmtpbmRdfSBpbiAke3RoaXMuZmlsZS5maWxlTmFtZX06YDtcbiAgICAgIGNvbnN0IHtsaW5lLCBjaGFyYWN0ZXJ9ID0gdGhpcy5maWxlLmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKG5vZGUuZ2V0U3RhcnQoKSk7XG4gICAgICBlLm1lc3NhZ2UgKz0gYCR7bGluZSArIDF9OiR7Y2hhcmFjdGVyICsgMX1gO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gICAgdGhpcy5pbmRlbnQtLTtcbiAgfVxuXG4gIC8qKlxuICAgKiBtYXliZVByb2Nlc3MgbGV0cyBzdWJjbGFzc2VzIG9wdGlvbmFsbHkgcHJvY2Vzc2VzIGEgbm9kZS5cbiAgICpcbiAgICogQHJldHVybiBUcnVlIGlmIHRoZSBub2RlIGhhcyBiZWVuIGhhbmRsZWQgYW5kIGRvZXNuJ3QgbmVlZCB0byBiZSB0cmF2ZXJzZWQ7XG4gICAqICAgIGZhbHNlIHRvIGhhdmUgdGhlIG5vZGUgd3JpdHRlbiBhbmQgaXRzIGNoaWxkcmVuIHJlY3Vyc2l2ZWx5IHZpc2l0ZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgbWF5YmVQcm9jZXNzKG5vZGU6IHRzLk5vZGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogd3JpdGVOb2RlIHdyaXRlcyBhIHRzLk5vZGUsIGNhbGxpbmcgdGhpcy52aXNpdCgpIG9uIGl0cyBjaGlsZHJlbi4gKi9cbiAgd3JpdGVOb2RlKG5vZGU6IHRzLk5vZGUsIHNraXBDb21tZW50cyA9IGZhbHNlLCBuZXdMaW5lSWZDb21tZW50c1N0cmlwcGVkID0gdHJ1ZSkge1xuICAgIGxldCBwb3MgPSBub2RlLmdldEZ1bGxTdGFydCgpO1xuICAgIGlmIChza2lwQ29tbWVudHMpIHtcbiAgICAgIC8vIFRvIHNraXAgY29tbWVudHMsIHdlIHNraXAgYWxsIHdoaXRlc3BhY2UvY29tbWVudHMgcHJlY2VkaW5nXG4gICAgICAvLyB0aGUgbm9kZS4gIEJ1dCBpZiB0aGVyZSB3YXMgYW55dGhpbmcgc2tpcHBlZCB3ZSBzaG91bGQgZW1pdFxuICAgICAgLy8gYSBuZXdsaW5lIGluIGl0cyBwbGFjZSBzbyB0aGF0IHRoZSBub2RlIHJlbWFpbnMgc2VwYXJhdGVkXG4gICAgICAvLyBmcm9tIHRoZSBwcmV2aW91cyBub2RlLiAgVE9ETzogZG9uJ3Qgc2tpcCBhbnl0aGluZyBoZXJlIGlmXG4gICAgICAvLyB0aGVyZSB3YXNuJ3QgYW55IGNvbW1lbnQuXG4gICAgICBpZiAobmV3TGluZUlmQ29tbWVudHNTdHJpcHBlZCAmJiBub2RlLmdldEZ1bGxTdGFydCgpIDwgbm9kZS5nZXRTdGFydCgpKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnXFxuJyk7XG4gICAgICB9XG4gICAgICBwb3MgPSBub2RlLmdldFN0YXJ0KCk7XG4gICAgfVxuICAgIHRoaXMud3JpdGVOb2RlRnJvbShub2RlLCBwb3MpO1xuICB9XG5cbiAgd3JpdGVOb2RlRnJvbShub2RlOiB0cy5Ob2RlLCBwb3M6IG51bWJlciwgZW5kID0gbm9kZS5nZXRFbmQoKSkge1xuICAgIGlmIChlbmQgPD0gdGhpcy5za2lwQ29tbWVudHNVcFRvT2Zmc2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9sZFNraXBDb21tZW50c1VwVG9PZmZzZXQgPSB0aGlzLnNraXBDb21tZW50c1VwVG9PZmZzZXQ7XG4gICAgdGhpcy5za2lwQ29tbWVudHNVcFRvT2Zmc2V0ID0gTWF0aC5tYXgodGhpcy5za2lwQ29tbWVudHNVcFRvT2Zmc2V0LCBwb3MpO1xuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCBjaGlsZCA9PiB7XG4gICAgICB0aGlzLndyaXRlUmFuZ2Uobm9kZSwgcG9zLCBjaGlsZC5nZXRGdWxsU3RhcnQoKSk7XG4gICAgICB0aGlzLnZpc2l0KGNoaWxkKTtcbiAgICAgIHBvcyA9IGNoaWxkLmdldEVuZCgpO1xuICAgIH0pO1xuICAgIHRoaXMud3JpdGVSYW5nZShub2RlLCBwb3MsIGVuZCk7XG4gICAgdGhpcy5za2lwQ29tbWVudHNVcFRvT2Zmc2V0ID0gb2xkU2tpcENvbW1lbnRzVXBUb09mZnNldDtcbiAgfVxuXG4gIHdyaXRlTGVhZGluZ1RyaXZpYShub2RlOiB0cy5Ob2RlKSB7XG4gICAgdGhpcy53cml0ZVJhbmdlKG5vZGUsIG5vZGUuZ2V0RnVsbFN0YXJ0KCksIG5vZGUuZ2V0U3RhcnQoKSk7XG4gIH1cblxuICBhZGRTb3VyY2VNYXBwaW5nKG5vZGU6IHRzLk5vZGUpIHtcbiAgICB0aGlzLndyaXRlUmFuZ2Uobm9kZSwgbm9kZS5nZXRFbmQoKSwgbm9kZS5nZXRFbmQoKSk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgYSBzcGFuIG9mIHRoZSBpbnB1dCBmaWxlIGFzIGV4cHJlc3NlZCBieSBhYnNvbHV0ZSBvZmZzZXRzLlxuICAgKiBUaGVzZSBvZmZzZXRzIGFyZSBmb3VuZCBpbiBhdHRyaWJ1dGVzIGxpa2Ugbm9kZS5nZXRGdWxsU3RhcnQoKSBhbmRcbiAgICogbm9kZS5nZXRFbmQoKS5cbiAgICovXG4gIHdyaXRlUmFuZ2Uobm9kZTogdHMuTm9kZSwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyKSB7XG4gICAgY29uc3QgZnVsbFN0YXJ0ID0gbm9kZS5nZXRGdWxsU3RhcnQoKTtcbiAgICBjb25zdCB0ZXh0U3RhcnQgPSBub2RlLmdldFN0YXJ0KCk7XG4gICAgaWYgKGZyb20gPj0gZnVsbFN0YXJ0ICYmIGZyb20gPCB0ZXh0U3RhcnQpIHtcbiAgICAgIGZyb20gPSBNYXRoLm1heChmcm9tLCB0aGlzLnNraXBDb21tZW50c1VwVG9PZmZzZXQpO1xuICAgIH1cbiAgICAvLyBBZGQgYSBzb3VyY2UgbWFwcGluZy4gd3JpdGVSYW5nZShmcm9tLCB0bykgYWx3YXlzIGNvcnJlc3BvbmRzIHRvXG4gICAgLy8gb3JpZ2luYWwgc291cmNlIGNvZGUsIHNvIGFkZCBhIG1hcHBpbmcgYXQgdGhlIGN1cnJlbnQgbG9jYXRpb24gdGhhdFxuICAgIC8vIHBvaW50cyBiYWNrIHRvIHRoZSBsb2NhdGlvbiBhdCBgZnJvbWAuIFRoZSBhZGRpdGlvbmFsIGNvZGUgZ2VuZXJhdGVkXG4gICAgLy8gYnkgdHNpY2tsZSB3aWxsIHRoZW4gYmUgY29uc2lkZXJlZCBwYXJ0IG9mIHRoZSBsYXN0IG1hcHBlZCBjb2RlXG4gICAgLy8gc2VjdGlvbiBwcmVjZWRpbmcgaXQuIFRoYXQncyBhcmd1YWJseSBpbmNvcnJlY3QgKGUuZy4gZm9yIHRoZSBmYWtlXG4gICAgLy8gbWV0aG9kcyBkZWZpbmluZyBwcm9wZXJ0aWVzKSwgYnV0IGlzIGdvb2QgZW5vdWdoIGZvciBzdGFjayB0cmFjZXMuXG4gICAgY29uc3QgcG9zID0gdGhpcy5maWxlLmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKGZyb20pO1xuICAgIHRoaXMuc291cmNlTWFwcGVyLmFkZE1hcHBpbmcoXG4gICAgICAgIG5vZGUsIHtsaW5lOiBwb3MubGluZSwgY29sdW1uOiBwb3MuY2hhcmFjdGVyLCBwb3NpdGlvbjogZnJvbX0sIHRoaXMucG9zaXRpb24sIHRvIC0gZnJvbSk7XG4gICAgLy8gZ2V0U291cmNlRmlsZSgpLmdldFRleHQoKSBpcyB3cm9uZyBoZXJlIGJlY2F1c2UgaXQgaGFzIHRoZSB0ZXh0IG9mXG4gICAgLy8gdGhlIFNvdXJjZUZpbGUgbm9kZSBvZiB0aGUgQVNULCB3aGljaCBkb2Vzbid0IGNvbnRhaW4gdGhlIGNvbW1lbnRzXG4gICAgLy8gcHJlY2VkaW5nIHRoYXQgbm9kZS4gIFNlbWFudGljYWxseSB0aGVzZSByYW5nZXMgYXJlIGp1c3Qgb2Zmc2V0c1xuICAgIC8vIGludG8gdGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlIHRleHQsIHNvIHNsaWNlIGZyb20gdGhhdC5cbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5maWxlLnRleHQuc2xpY2UoZnJvbSwgdG8pO1xuICAgIGlmICh0ZXh0KSB7XG4gICAgICB0aGlzLmVtaXQodGV4dCk7XG4gICAgfVxuICB9XG5cbiAgZW1pdChzdHI6IHN0cmluZykge1xuICAgIHRoaXMub3V0cHV0LnB1c2goc3RyKTtcbiAgICBmb3IgKGNvbnN0IGMgb2Ygc3RyKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uLmNvbHVtbisrO1xuICAgICAgaWYgKGMgPT09ICdcXG4nKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ubGluZSsrO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLmNvbHVtbiA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb24ucG9zaXRpb24gKz0gc3RyLmxlbmd0aDtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGNvbW1lbnQgbWV0YWNoYXJhY3RlcnMgZnJvbSBhIHN0cmluZywgdG8gbWFrZSBpdCBzYWZlIHRvIGVtYmVkIGluIGEgY29tbWVudC4gKi9cbiAgZXNjYXBlRm9yQ29tbWVudChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXC9cXCovZywgJ19fJykucmVwbGFjZSgvXFwqXFwvL2csICdfXycpO1xuICB9XG5cbiAgLyogdHNsaW50OmRpc2FibGU6IG5vLXVudXNlZC12YXJpYWJsZSAqL1xuICBsb2dXaXRoSW5kZW50KG1lc3NhZ2U6IHN0cmluZykge1xuICAgIC8qIHRzbGludDplbmFibGU6IG5vLXVudXNlZC12YXJpYWJsZSAqL1xuICAgIGNvbnN0IHByZWZpeCA9IG5ldyBBcnJheSh0aGlzLmluZGVudCArIDEpLmpvaW4oJ3wgJyk7XG4gICAgY29uc29sZS5sb2cocHJlZml4ICsgbWVzc2FnZSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvZHVjZXMgYSBjb21waWxlciBlcnJvciB0aGF0IHJlZmVyZW5jZXMgdGhlIE5vZGUncyBraW5kLiAgVGhpcyBpcyB1c2VmdWwgZm9yIHRoZSBcImVsc2VcIlxuICAgKiBicmFuY2ggb2YgY29kZSB0aGF0IGlzIGF0dGVtcHRpbmcgdG8gaGFuZGxlIGFsbCBwb3NzaWJsZSBpbnB1dCBOb2RlIHR5cGVzLCB0byBlbnN1cmUgYWxsIGNhc2VzXG4gICAqIGNvdmVyZWQuXG4gICAqL1xuICBlcnJvclVuaW1wbGVtZW50ZWRLaW5kKG5vZGU6IHRzLk5vZGUsIHdoZXJlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmVycm9yKG5vZGUsIGAke3RzLlN5bnRheEtpbmRbbm9kZS5raW5kXX0gbm90IGltcGxlbWVudGVkIGluICR7d2hlcmV9YCk7XG4gIH1cblxuICBlcnJvcihub2RlOiB0cy5Ob2RlLCBtZXNzYWdlVGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy5kaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgIGZpbGU6IHRoaXMuZmlsZSxcbiAgICAgIHN0YXJ0OiBub2RlLmdldFN0YXJ0KCksXG4gICAgICBsZW5ndGg6IG5vZGUuZ2V0RW5kKCkgLSBub2RlLmdldFN0YXJ0KCksXG4gICAgICBtZXNzYWdlVGV4dCxcbiAgICAgIGNhdGVnb3J5OiB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IsXG4gICAgICBjb2RlOiAwLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBzdHJpbmcgY29udGVudHMgb2YgYSB0cy5JZGVudGlmaWVyLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldElkZW50aWZpZXJUZXh0KGlkZW50aWZpZXI6IHRzLklkZW50aWZpZXIpOiBzdHJpbmcge1xuICAvLyBOT1RFOiB0aGUgJ3RleHQnIHByb3BlcnR5IG9uIGFuIElkZW50aWZpZXIgbWF5IGJlIGVzY2FwZWQgaWYgaXQgc3RhcnRzXG4gIC8vIHdpdGggJ19fJywgc28ganVzdCB1c2UgZ2V0VGV4dCgpLlxuICByZXR1cm4gaWRlbnRpZmllci5nZXRUZXh0KCk7XG59XG5cbi8qKiBSZXR1cm5zIGEgZG90LWpvaW5lZCBxdWFsaWZpZWQgbmFtZSAoZm9vLmJhci5CYXopLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVudGl0eU5hbWVUZXh0KG5hbWU6IHRzLkVudGl0eU5hbWUpOiBzdHJpbmcge1xuICBpZiAodHMuaXNJZGVudGlmaWVyKG5hbWUpKSB7XG4gICAgcmV0dXJuIGdldElkZW50aWZpZXJUZXh0KG5hbWUpO1xuICB9XG4gIHJldHVybiBnZXRFbnRpdHlOYW1lVGV4dChuYW1lLmxlZnQpICsgJy4nICsgZ2V0SWRlbnRpZmllclRleHQobmFtZS5yaWdodCk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYW4gZXNjYXBlZCBUeXBlU2NyaXB0IG5hbWUgaW50byB0aGUgb3JpZ2luYWwgc291cmNlIG5hbWUuXG4gKiBQcmVmZXIgZ2V0SWRlbnRpZmllclRleHQoKSBpbnN0ZWFkIGlmIHBvc3NpYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5lc2NhcGVOYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFNlZSB0aGUgcHJpdmF0ZSBmdW5jdGlvbiB1bmVzY2FwZUlkZW50aWZpZXIgaW4gVHlwZVNjcmlwdCdzIHV0aWxpdGllcy50cy5cbiAgaWYgKG5hbWUubWF0Y2goL15fX18vKSkgcmV0dXJuIG5hbWUuc3Vic3RyKDEpO1xuICByZXR1cm4gbmFtZTtcbn1cbiJdfQ==