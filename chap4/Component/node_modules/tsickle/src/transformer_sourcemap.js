/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("tsickle/src/transformer_sourcemap", ["require", "exports", "tsickle/src/transformer_util", "tsickle/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var transformer_util_1 = require("tsickle/src/transformer_util");
    var ts = require("tsickle/src/typescript");
    /**
     * @fileoverview Creates a TypeScript transformer that parses code into a new `ts.SourceFile`,
     * marks the nodes as synthetic and where possible maps the new nodes back to the original nodes
     * via sourcemap information.
     */
    function createTransformerFromSourceMap(operator) {
        return function (context) { return function (sourceFile) {
            var sourceMapper = new NodeSourceMapper();
            var newFile = ts.createSourceFile(sourceFile.fileName, operator(sourceFile, sourceMapper), ts.ScriptTarget.Latest, true);
            var mappedFile = visitNode(newFile);
            return transformer_util_1.updateSourceFileNode(sourceFile, mappedFile.statements);
            function visitNode(node) {
                return transformer_util_1.visitNodeWithSynthesizedComments(context, newFile, node, visitNodeImpl);
            }
            function visitNodeImpl(node) {
                if (node.flags & ts.NodeFlags.Synthesized) {
                    return node;
                }
                var originalNode = sourceMapper.getOriginalNode(node);
                // Use the originalNode for:
                // - literals: as e.g. typescript does not support synthetic regex literals
                // - identifiers: as they don't have children and behave well
                //    regarding comment synthesization
                // - types: as they are not emited anyways
                //          and it leads to errors with `extends` cases.
                if (originalNode &&
                    (isLiteralKind(node.kind) || node.kind === ts.SyntaxKind.Identifier ||
                        transformer_util_1.isTypeNodeKind(node.kind) || node.kind === ts.SyntaxKind.IndexSignature)) {
                    return originalNode;
                }
                node = ts.visitEachChild(node, visitNode, context);
                node.flags |= ts.NodeFlags.Synthesized;
                node.parent = undefined;
                ts.setTextRange(node, originalNode ? originalNode : { pos: -1, end: -1 });
                ts.setOriginalNode(node, originalNode);
                // Loop over all nested ts.NodeArrays /
                // ts.Nodes that were not visited and set their
                // text range to -1 to not emit their whitespace.
                // Sadly, TypeScript does not have an API for this...
                // tslint:disable-next-line:no-any To read all properties
                var nodeAny = node;
                // tslint:disable-next-line:no-any To read all properties
                var originalNodeAny = originalNode;
                for (var prop in nodeAny) {
                    if (nodeAny.hasOwnProperty(prop)) {
                        // tslint:disable-next-line:no-any
                        var value = nodeAny[prop];
                        if (isNodeArray(value)) {
                            // reset the pos/end of all NodeArrays so that we don't emit comments
                            // from them.
                            ts.setTextRange(value, { pos: -1, end: -1 });
                        }
                        else if (isToken(value) && !(value.flags & ts.NodeFlags.Synthesized) &&
                            value.getSourceFile() !== sourceFile) {
                            // Use the original TextRange for all non visited tokens (e.g. the
                            // `BinaryExpression.operatorToken`) to preserve the formatting
                            var textRange = originalNode ? originalNodeAny[prop] : { pos: -1, end: -1 };
                            ts.setTextRange(value, textRange);
                        }
                    }
                }
                return node;
            }
        }; };
    }
    exports.createTransformerFromSourceMap = createTransformerFromSourceMap;
    /**
     * Implementation of the `SourceMapper` that stores and retrieves mappings
     * to original nodes.
     */
    var NodeSourceMapper = /** @class */ (function () {
        function NodeSourceMapper() {
            this.originalNodeByGeneratedRange = new Map();
            this.genStartPositions = new Map();
        }
        NodeSourceMapper.prototype.addFullNodeRange = function (node, genStartPos) {
            var _this = this;
            this.originalNodeByGeneratedRange.set(this.nodeCacheKey(node.kind, genStartPos, genStartPos + (node.getEnd() - node.getStart())), node);
            node.forEachChild(function (child) { return _this.addFullNodeRange(child, genStartPos + (child.getStart() - node.getStart())); });
        };
        NodeSourceMapper.prototype.addMapping = function (originalNode, original, generated, length) {
            var _this = this;
            var originalStartPos = original.position;
            var genStartPos = generated.position;
            if (originalStartPos >= originalNode.getFullStart() &&
                originalStartPos <= originalNode.getStart()) {
                // always use the node.getStart() for the index,
                // as comments and whitespaces might differ between the original and transformed code.
                var diffToStart = originalNode.getStart() - originalStartPos;
                originalStartPos += diffToStart;
                genStartPos += diffToStart;
                length -= diffToStart;
                this.genStartPositions.set(originalNode, genStartPos);
            }
            if (originalStartPos + length === originalNode.getEnd()) {
                this.originalNodeByGeneratedRange.set(this.nodeCacheKey(originalNode.kind, this.genStartPositions.get(originalNode), genStartPos + length), originalNode);
            }
            originalNode.forEachChild(function (child) {
                if (child.getStart() >= originalStartPos && child.getEnd() <= originalStartPos + length) {
                    _this.addFullNodeRange(child, genStartPos + (child.getStart() - originalStartPos));
                }
            });
        };
        NodeSourceMapper.prototype.getOriginalNode = function (node) {
            return this.originalNodeByGeneratedRange.get(this.nodeCacheKey(node.kind, node.getStart(), node.getEnd()));
        };
        NodeSourceMapper.prototype.nodeCacheKey = function (kind, start, end) {
            return kind + "#" + start + "#" + end;
        };
        return NodeSourceMapper;
    }());
    // tslint:disable-next-line:no-any
    function isNodeArray(value) {
        var anyValue = value;
        return Array.isArray(value) && anyValue.pos !== undefined && anyValue.end !== undefined;
    }
    // tslint:disable-next-line:no-any
    function isToken(value) {
        return value != null && typeof value === 'object' && value.kind >= ts.SyntaxKind.FirstToken &&
            value.kind <= ts.SyntaxKind.LastToken;
    }
    // Copied from TypeScript
    function isLiteralKind(kind) {
        return ts.SyntaxKind.FirstLiteralToken <= kind && kind <= ts.SyntaxKind.LastLiteralToken;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXJfc291cmNlbWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3RyYW5zZm9ybWVyX3NvdXJjZW1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUdILGlFQUEwRztJQUMxRywyQ0FBbUM7SUFFbkM7Ozs7T0FJRztJQUNILHdDQUNJLFFBQ1U7UUFDWixNQUFNLENBQUMsVUFBQyxPQUFPLElBQUssT0FBQSxVQUFDLFVBQVU7WUFDN0IsSUFBTSxZQUFZLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzVDLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDL0IsVUFBVSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNGLElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsdUNBQW9CLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUUvRCxtQkFBc0MsSUFBTztnQkFDM0MsTUFBTSxDQUFDLG1EQUFnQyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBTSxDQUFDO1lBQ3RGLENBQUM7WUFFRCx1QkFBdUIsSUFBYTtnQkFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFDRCxJQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV4RCw0QkFBNEI7Z0JBQzVCLDJFQUEyRTtnQkFDM0UsNkRBQTZE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QUEvQ0QsSUErQ0M7SUFFRCxrQ0FBa0M7SUFDbEMscUJBQXFCLEtBQVU7UUFDN0IsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEtBQUssU0FBUyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDO0lBQzFGLENBQUM7SUFFRCxrQ0FBa0M7SUFDbEMsaUJBQWlCLEtBQVU7UUFDekIsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVO1lBQ3ZGLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7SUFDNUMsQ0FBQztJQUVELHlCQUF5QjtJQUN6Qix1QkFBdUIsSUFBbUI7UUFDeEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0lBQzNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7U291cmNlTWFwcGVyLCBTb3VyY2VQb3NpdGlvbn0gZnJvbSAnLi9zb3VyY2VfbWFwX3V0aWxzJztcbmltcG9ydCB7aXNUeXBlTm9kZUtpbmQsIHVwZGF0ZVNvdXJjZUZpbGVOb2RlLCB2aXNpdE5vZGVXaXRoU3ludGhlc2l6ZWRDb21tZW50c30gZnJvbSAnLi90cmFuc2Zvcm1lcl91dGlsJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJy4vdHlwZXNjcmlwdCc7XG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBDcmVhdGVzIGEgVHlwZVNjcmlwdCB0cmFuc2Zvcm1lciB0aGF0IHBhcnNlcyBjb2RlIGludG8gYSBuZXcgYHRzLlNvdXJjZUZpbGVgLFxuICogbWFya3MgdGhlIG5vZGVzIGFzIHN5bnRoZXRpYyBhbmQgd2hlcmUgcG9zc2libGUgbWFwcyB0aGUgbmV3IG5vZGVzIGJhY2sgdG8gdGhlIG9yaWdpbmFsIG5vZGVzXG4gKiB2aWEgc291cmNlbWFwIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNmb3JtZXJGcm9tU291cmNlTWFwKFxuICAgIG9wZXJhdG9yOiAoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgc291cmNlTWFwcGVyOiBTb3VyY2VNYXBwZXIpID0+XG4gICAgICAgIHN0cmluZyk6IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPiB7XG4gIHJldHVybiAoY29udGV4dCkgPT4gKHNvdXJjZUZpbGUpID0+IHtcbiAgICBjb25zdCBzb3VyY2VNYXBwZXIgPSBuZXcgTm9kZVNvdXJjZU1hcHBlcigpO1xuICAgIGNvbnN0IG5ld0ZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLmZpbGVOYW1lLCBvcGVyYXRvcihzb3VyY2VGaWxlLCBzb3VyY2VNYXBwZXIpLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCB0cnVlKTtcbiAgICBjb25zdCBtYXBwZWRGaWxlID0gdmlzaXROb2RlKG5ld0ZpbGUpO1xuICAgIHJldHVybiB1cGRhdGVTb3VyY2VGaWxlTm9kZShzb3VyY2VGaWxlLCBtYXBwZWRGaWxlLnN0YXRlbWVudHMpO1xuXG4gICAgZnVuY3Rpb24gdmlzaXROb2RlPFQgZXh0ZW5kcyB0cy5Ob2RlPihub2RlOiBUKTogVCB7XG4gICAgICByZXR1cm4gdmlzaXROb2RlV2l0aFN5bnRoZXNpemVkQ29tbWVudHMoY29udGV4dCwgbmV3RmlsZSwgbm9kZSwgdmlzaXROb2RlSW1wbCkgYXMgVDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2aXNpdE5vZGVJbXBsKG5vZGU6IHRzLk5vZGUpIHtcbiAgICAgIGlmIChub2RlLmZsYWdzICYgdHMuTm9kZUZsYWdzLlN5bnRoZXNpemVkKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3JpZ2luYWxOb2RlID0gc291cmNlTWFwcGVyLmdldE9yaWdpbmFsTm9kZShub2RlKTtcblxuICAgICAgLy8gVXNlIHRoZSBvcmlnaW5hbE5vZGUgZm9yOlxuICAgICAgLy8gLSBsaXRlcmFsczogYXMgZS5nLiB0eXBlc2NyaXB0IGRvZXMgbm90IHN1cHBvcnQgc3ludGhldGljIHJlZ2V4IGxpdGVyYWxzXG4gICAgICAvLyAtIGlkZW50aWZpZXJzOiBhcyB0aGV5IGRvbid0IGhhdmUgY2hpbGRyZW4gYW5kIGJlaGF2ZSB3ZWxsXG4gICAgICAvLyAgICByZWdhcmRpbmcgY29tbWVudCBzeW50aGVzaXphdGlvblxuICAgICAgLy8gLSB0eXBlczogYXMgdGhleSBhcmUgbm90IGVtaXRlZCBhbnl3YXlzXG4gICAgICAvLyAgICAgICAgICBhbmQgaXQgbGVhZHMgdG8gZXJyb3JzIHdpdGggYGV4dGVuZHNgIGNhc2VzLlxuICAgICAgaWYgKG9yaWdpbmFsTm9kZSAmJlxuICAgICAgICAgIChpc0xpdGVyYWxLaW5kKG5vZGUua2luZCkgfHwgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIgfHxcbiAgICAgICAgICAgaXNUeXBlTm9kZUtpbmQobm9kZS5raW5kKSB8fCBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSW5kZXhTaWduYXR1cmUpKSB7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbE5vZGU7XG4gICAgICB9XG4gICAgICBub2RlID0gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXROb2RlLCBjb250ZXh0KTtcblxuICAgICAgbm9kZS5mbGFncyB8PSB0cy5Ob2RlRmxhZ3MuU3ludGhlc2l6ZWQ7XG4gICAgICBub2RlLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRzLnNldFRleHRSYW5nZShub2RlLCBvcmlnaW5hbE5vZGUgPyBvcmlnaW5hbE5vZGUgOiB7cG9zOiAtMSwgZW5kOiAtMX0pO1xuICAgICAgdHMuc2V0T3JpZ2luYWxOb2RlKG5vZGUsIG9yaWdpbmFsTm9kZSk7XG5cbiAgICAgIC8vIExvb3Agb3ZlciBhbGwgbmVzdGVkIHRzLk5vZGVBcnJheXMgL1xuICAgICAgLy8gdHMuTm9kZXMgdGhhdCB3ZXJlIG5vdCB2aXNpdGVkIGFuZCBzZXQgdGhlaXJcbiAgICAgIC8vIHRleHQgcmFuZ2UgdG8gLTEgdG8gbm90IGVtaXQgdGhlaXIgd2hpdGVzcGFjZS5cbiAgICAgIC8vIFNhZGx5LCBUeXBlU2NyaXB0IGRvZXMgbm90IGhhdmUgYW4gQVBJIGZvciB0aGlzLi4uXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55IFRvIHJlYWQgYWxsIHByb3BlcnRpZXNcbiAgICAgIGNvbnN0IG5vZGVBbnkgPSBub2RlIGFzIHtba2V5OiBzdHJpbmddOiBhbnl9O1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSBUbyByZWFkIGFsbCBwcm9wZXJ0aWVzXG4gICAgICBjb25zdCBvcmlnaW5hbE5vZGVBbnkgPSBvcmlnaW5hbE5vZGUgYXMge1trZXk6IHN0cmluZ106IGFueX07XG4gICAgICBmb3IgKGNvbnN0IHByb3AgaW4gbm9kZUFueSkge1xuICAgICAgICBpZiAobm9kZUFueS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IG5vZGVBbnlbcHJvcF07XG4gICAgICAgICAgaWYgKGlzTm9kZUFycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gcmVzZXQgdGhlIHBvcy9lbmQgb2YgYWxsIE5vZGVBcnJheXMgc28gdGhhdCB3ZSBkb24ndCBlbWl0IGNvbW1lbnRzXG4gICAgICAgICAgICAvLyBmcm9tIHRoZW0uXG4gICAgICAgICAgICB0cy5zZXRUZXh0UmFuZ2UodmFsdWUsIHtwb3M6IC0xLCBlbmQ6IC0xfSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgaXNUb2tlbih2YWx1ZSkgJiYgISh2YWx1ZS5mbGFncyAmIHRzLk5vZGVGbGFncy5TeW50aGVzaXplZCkgJiZcbiAgICAgICAgICAgICAgdmFsdWUuZ2V0U291cmNlRmlsZSgpICE9PSBzb3VyY2VGaWxlKSB7XG4gICAgICAgICAgICAvLyBVc2UgdGhlIG9yaWdpbmFsIFRleHRSYW5nZSBmb3IgYWxsIG5vbiB2aXNpdGVkIHRva2VucyAoZS5nLiB0aGVcbiAgICAgICAgICAgIC8vIGBCaW5hcnlFeHByZXNzaW9uLm9wZXJhdG9yVG9rZW5gKSB0byBwcmVzZXJ2ZSB0aGUgZm9ybWF0dGluZ1xuICAgICAgICAgICAgY29uc3QgdGV4dFJhbmdlID0gb3JpZ2luYWxOb2RlID8gb3JpZ2luYWxOb2RlQW55W3Byb3BdIDoge3BvczogLTEsIGVuZDogLTF9O1xuICAgICAgICAgICAgdHMuc2V0VGV4dFJhbmdlKHZhbHVlLCB0ZXh0UmFuZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgdGhlIGBTb3VyY2VNYXBwZXJgIHRoYXQgc3RvcmVzIGFuZCByZXRyaWV2ZXMgbWFwcGluZ3NcbiAqIHRvIG9yaWdpbmFsIG5vZGVzLlxuICovXG5jbGFzcyBOb2RlU291cmNlTWFwcGVyIGltcGxlbWVudHMgU291cmNlTWFwcGVyIHtcbiAgcHJpdmF0ZSBvcmlnaW5hbE5vZGVCeUdlbmVyYXRlZFJhbmdlID0gbmV3IE1hcDxzdHJpbmcsIHRzLk5vZGU+KCk7XG4gIHByaXZhdGUgZ2VuU3RhcnRQb3NpdGlvbnMgPSBuZXcgTWFwPHRzLk5vZGUsIG51bWJlcj4oKTtcblxuICBwcml2YXRlIGFkZEZ1bGxOb2RlUmFuZ2Uobm9kZTogdHMuTm9kZSwgZ2VuU3RhcnRQb3M6IG51bWJlcikge1xuICAgIHRoaXMub3JpZ2luYWxOb2RlQnlHZW5lcmF0ZWRSYW5nZS5zZXQoXG4gICAgICAgIHRoaXMubm9kZUNhY2hlS2V5KG5vZGUua2luZCwgZ2VuU3RhcnRQb3MsIGdlblN0YXJ0UG9zICsgKG5vZGUuZ2V0RW5kKCkgLSBub2RlLmdldFN0YXJ0KCkpKSxcbiAgICAgICAgbm9kZSk7XG4gICAgbm9kZS5mb3JFYWNoQ2hpbGQoXG4gICAgICAgIGNoaWxkID0+IHRoaXMuYWRkRnVsbE5vZGVSYW5nZShjaGlsZCwgZ2VuU3RhcnRQb3MgKyAoY2hpbGQuZ2V0U3RhcnQoKSAtIG5vZGUuZ2V0U3RhcnQoKSkpKTtcbiAgfVxuXG4gIGFkZE1hcHBpbmcoXG4gICAgICBvcmlnaW5hbE5vZGU6IHRzLk5vZGUsIG9yaWdpbmFsOiBTb3VyY2VQb3NpdGlvbiwgZ2VuZXJhdGVkOiBTb3VyY2VQb3NpdGlvbiwgbGVuZ3RoOiBudW1iZXIpIHtcbiAgICBsZXQgb3JpZ2luYWxTdGFydFBvcyA9IG9yaWdpbmFsLnBvc2l0aW9uO1xuICAgIGxldCBnZW5TdGFydFBvcyA9IGdlbmVyYXRlZC5wb3NpdGlvbjtcbiAgICBpZiAob3JpZ2luYWxTdGFydFBvcyA+PSBvcmlnaW5hbE5vZGUuZ2V0RnVsbFN0YXJ0KCkgJiZcbiAgICAgICAgb3JpZ2luYWxTdGFydFBvcyA8PSBvcmlnaW5hbE5vZGUuZ2V0U3RhcnQoKSkge1xuICAgICAgLy8gYWx3YXlzIHVzZSB0aGUgbm9kZS5nZXRTdGFydCgpIGZvciB0aGUgaW5kZXgsXG4gICAgICAvLyBhcyBjb21tZW50cyBhbmQgd2hpdGVzcGFjZXMgbWlnaHQgZGlmZmVyIGJldHdlZW4gdGhlIG9yaWdpbmFsIGFuZCB0cmFuc2Zvcm1lZCBjb2RlLlxuICAgICAgY29uc3QgZGlmZlRvU3RhcnQgPSBvcmlnaW5hbE5vZGUuZ2V0U3RhcnQoKSAtIG9yaWdpbmFsU3RhcnRQb3M7XG4gICAgICBvcmlnaW5hbFN0YXJ0UG9zICs9IGRpZmZUb1N0YXJ0O1xuICAgICAgZ2VuU3RhcnRQb3MgKz0gZGlmZlRvU3RhcnQ7XG4gICAgICBsZW5ndGggLT0gZGlmZlRvU3RhcnQ7XG4gICAgICB0aGlzLmdlblN0YXJ0UG9zaXRpb25zLnNldChvcmlnaW5hbE5vZGUsIGdlblN0YXJ0UG9zKTtcbiAgICB9XG4gICAgaWYgKG9yaWdpbmFsU3RhcnRQb3MgKyBsZW5ndGggPT09IG9yaWdpbmFsTm9kZS5nZXRFbmQoKSkge1xuICAgICAgdGhpcy5vcmlnaW5hbE5vZGVCeUdlbmVyYXRlZFJhbmdlLnNldChcbiAgICAgICAgICB0aGlzLm5vZGVDYWNoZUtleShcbiAgICAgICAgICAgICAgb3JpZ2luYWxOb2RlLmtpbmQsIHRoaXMuZ2VuU3RhcnRQb3NpdGlvbnMuZ2V0KG9yaWdpbmFsTm9kZSkhLCBnZW5TdGFydFBvcyArIGxlbmd0aCksXG4gICAgICAgICAgb3JpZ2luYWxOb2RlKTtcbiAgICB9XG4gICAgb3JpZ2luYWxOb2RlLmZvckVhY2hDaGlsZCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChjaGlsZC5nZXRTdGFydCgpID49IG9yaWdpbmFsU3RhcnRQb3MgJiYgY2hpbGQuZ2V0RW5kKCkgPD0gb3JpZ2luYWxTdGFydFBvcyArIGxlbmd0aCkge1xuICAgICAgICB0aGlzLmFkZEZ1bGxOb2RlUmFuZ2UoY2hpbGQsIGdlblN0YXJ0UG9zICsgKGNoaWxkLmdldFN0YXJ0KCkgLSBvcmlnaW5hbFN0YXJ0UG9zKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRPcmlnaW5hbE5vZGUobm9kZTogdHMuTm9kZSk6IHRzLk5vZGV8dW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5vcmlnaW5hbE5vZGVCeUdlbmVyYXRlZFJhbmdlLmdldChcbiAgICAgICAgdGhpcy5ub2RlQ2FjaGVLZXkobm9kZS5raW5kLCBub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0RW5kKCkpKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9kZUNhY2hlS2V5KGtpbmQ6IHRzLlN5bnRheEtpbmQsIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7a2luZH0jJHtzdGFydH0jJHtlbmR9YDtcbiAgfVxufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG5mdW5jdGlvbiBpc05vZGVBcnJheSh2YWx1ZTogYW55KTogdmFsdWUgaXMgdHMuTm9kZUFycmF5PGFueT4ge1xuICBjb25zdCBhbnlWYWx1ZSA9IHZhbHVlO1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgYW55VmFsdWUucG9zICE9PSB1bmRlZmluZWQgJiYgYW55VmFsdWUuZW5kICE9PSB1bmRlZmluZWQ7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbmZ1bmN0aW9uIGlzVG9rZW4odmFsdWU6IGFueSk6IHZhbHVlIGlzIHRzLlRva2VuPGFueT4ge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmtpbmQgPj0gdHMuU3ludGF4S2luZC5GaXJzdFRva2VuICYmXG4gICAgICB2YWx1ZS5raW5kIDw9IHRzLlN5bnRheEtpbmQuTGFzdFRva2VuO1xufVxuXG4vLyBDb3BpZWQgZnJvbSBUeXBlU2NyaXB0XG5mdW5jdGlvbiBpc0xpdGVyYWxLaW5kKGtpbmQ6IHRzLlN5bnRheEtpbmQpIHtcbiAgcmV0dXJuIHRzLlN5bnRheEtpbmQuRmlyc3RMaXRlcmFsVG9rZW4gPD0ga2luZCAmJiBraW5kIDw9IHRzLlN5bnRheEtpbmQuTGFzdExpdGVyYWxUb2tlbjtcbn1cbiJdfQ==