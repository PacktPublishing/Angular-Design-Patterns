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
        define("tsickle/src/source_map_utils", ["require", "exports", "source-map"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var source_map_1 = require("source-map");
    /**
     * Return a new RegExp object every time we want one because the
     * RegExp object has internal state that we don't want to persist
     * between different logical uses.
     */
    function getInlineSourceMapRegex() {
        return new RegExp('^//# sourceMappingURL=data:application/json;base64,(.*)$', 'mg');
    }
    function containsInlineSourceMap(source) {
        return getInlineSourceMapCount(source) > 0;
    }
    exports.containsInlineSourceMap = containsInlineSourceMap;
    function getInlineSourceMapCount(source) {
        var match = source.match(getInlineSourceMapRegex());
        return match ? match.length : 0;
    }
    exports.getInlineSourceMapCount = getInlineSourceMapCount;
    function extractInlineSourceMap(source) {
        var inlineSourceMapRegex = getInlineSourceMapRegex();
        var previousResult = null;
        var result = null;
        // We want to extract the last source map in the source file
        // since that's probably the most recent one added.  We keep
        // matching against the source until we don't get a result,
        // then we use the previous result.
        do {
            previousResult = result;
            result = inlineSourceMapRegex.exec(source);
        } while (result !== null);
        var base64EncodedMap = previousResult[1];
        return Buffer.from(base64EncodedMap, 'base64').toString('utf8');
    }
    exports.extractInlineSourceMap = extractInlineSourceMap;
    function removeInlineSourceMap(source) {
        return source.replace(getInlineSourceMapRegex(), '');
    }
    exports.removeInlineSourceMap = removeInlineSourceMap;
    /**
     * Sets the source map inline in the file.  If there's an existing inline source
     * map, it clobbers it.
     */
    function setInlineSourceMap(source, sourceMap) {
        var encodedSourceMap = Buffer.from(sourceMap, 'utf8').toString('base64');
        if (containsInlineSourceMap(source)) {
            return source.replace(getInlineSourceMapRegex(), "//# sourceMappingURL=data:application/json;base64," + encodedSourceMap);
        }
        else {
            return source + "\n//# sourceMappingURL=data:application/json;base64," + encodedSourceMap;
        }
    }
    exports.setInlineSourceMap = setInlineSourceMap;
    function parseSourceMap(text, fileName, sourceName) {
        var rawSourceMap = JSON.parse(text);
        if (sourceName) {
            rawSourceMap.sources = [sourceName];
        }
        if (fileName) {
            rawSourceMap.file = fileName;
        }
        return rawSourceMap;
    }
    exports.parseSourceMap = parseSourceMap;
    function sourceMapConsumerToGenerator(sourceMapConsumer) {
        return source_map_1.SourceMapGenerator.fromSourceMap(sourceMapConsumer);
    }
    exports.sourceMapConsumerToGenerator = sourceMapConsumerToGenerator;
    /**
     * Tsc identifies source files by their relative path to the output file.  Since
     * there's no easy way to identify these relative paths when tsickle generates its
     * own source maps, we patch them with the file name from the tsc source maps
     * before composing them.
     */
    function sourceMapGeneratorToConsumer(sourceMapGenerator, fileName, sourceName) {
        var rawSourceMap = sourceMapGenerator.toJSON();
        if (sourceName) {
            rawSourceMap.sources = [sourceName];
        }
        if (fileName) {
            rawSourceMap.file = fileName;
        }
        return new source_map_1.SourceMapConsumer(rawSourceMap);
    }
    exports.sourceMapGeneratorToConsumer = sourceMapGeneratorToConsumer;
    function sourceMapTextToConsumer(sourceMapText) {
        // the SourceMapConsumer constructor returns a BasicSourceMapConsumer or an
        // IndexedSourceMapConsumer depending on if you pass in a RawSourceMap or a
        // RawIndexMap or the string json of either.  In this case we're passing in
        // the string for a RawSourceMap, so we always get a BasicSourceMapConsumer
        return new source_map_1.SourceMapConsumer(sourceMapText);
    }
    exports.sourceMapTextToConsumer = sourceMapTextToConsumer;
    function sourceMapTextToGenerator(sourceMapText) {
        return source_map_1.SourceMapGenerator.fromSourceMap(sourceMapTextToConsumer(sourceMapText));
    }
    exports.sourceMapTextToGenerator = sourceMapTextToGenerator;
    exports.NOOP_SOURCE_MAPPER = {
        // tslint:disable-next-line:no-empty
        addMapping: function () { }
    };
    var DefaultSourceMapper = /** @class */ (function () {
        function DefaultSourceMapper(fileName) {
            this.fileName = fileName;
            /** The source map that's generated while rewriting this file. */
            this.sourceMap = new source_map_1.SourceMapGenerator();
            this.sourceMap.addMapping({
                // tsc's source maps use 1-indexed lines, 0-indexed columns
                original: { line: 1, column: 0 },
                generated: { line: 1, column: 0 },
                source: this.fileName,
            });
        }
        DefaultSourceMapper.prototype.addMapping = function (node, original, generated, length) {
            if (length > 0) {
                this.sourceMap.addMapping({
                    // tsc's source maps use 1-indexed lines, 0-indexed columns
                    original: { line: original.line + 1, column: original.column },
                    generated: { line: generated.line + 1, column: generated.column },
                    source: this.fileName,
                });
            }
        };
        return DefaultSourceMapper;
    }());
    exports.DefaultSourceMapper = DefaultSourceMapper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21hcF91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zb3VyY2VfbWFwX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgseUNBQXVHO0lBR3ZHOzs7O09BSUc7SUFDSDtRQUNFLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQywwREFBMEQsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQsaUNBQXdDLE1BQWM7UUFDcEQsTUFBTSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRkQsMERBRUM7SUFFRCxpQ0FBd0MsTUFBYztRQUNwRCxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUhELDBEQUdDO0lBRUQsZ0NBQXVDLE1BQWM7UUFDbkQsSUFBTSxvQkFBb0IsR0FBRyx1QkFBdUIsRUFBRSxDQUFDO1FBQ3ZELElBQUksY0FBYyxHQUF5QixJQUFJLENBQUM7UUFDaEQsSUFBSSxNQUFNLEdBQXlCLElBQUksQ0FBQztRQUN4Qyw0REFBNEQ7UUFDNUQsNERBQTREO1FBQzVELDJEQUEyRDtRQUMzRCxtQ0FBbUM7UUFDbkMsR0FBRyxDQUFDO1lBQ0YsY0FBYyxHQUFHLE1BQU0sQ0FBQztZQUN4QixNQUFNLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLENBQUMsUUFBUSxNQUFNLEtBQUssSUFBSSxFQUFFO1FBQzFCLElBQU0sZ0JBQWdCLEdBQUcsY0FBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBZEQsd0RBY0M7SUFFRCwrQkFBc0MsTUFBYztRQUNsRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFGRCxzREFFQztJQUVEOzs7T0FHRztJQUNILDRCQUFtQyxNQUFjLEVBQUUsU0FBaUI7UUFDbEUsSUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0UsRUFBRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUNqQix1QkFBdUIsRUFBRSxFQUN6Qix1REFBcUQsZ0JBQWtCLENBQUMsQ0FBQztRQUMvRSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUksTUFBTSw0REFBdUQsZ0JBQWtCLENBQUM7UUFDNUYsQ0FBQztJQUNILENBQUM7SUFURCxnREFTQztJQUVELHdCQUErQixJQUFZLEVBQUUsUUFBaUIsRUFBRSxVQUFtQjtRQUNqRixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBaUIsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2YsWUFBWSxDQUFDLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2IsWUFBWSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDL0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQVRELHdDQVNDO0lBRUQsc0NBQTZDLGlCQUFvQztRQUUvRSxNQUFNLENBQUMsK0JBQWtCLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUhELG9FQUdDO0lBRUQ7Ozs7O09BS0c7SUFDSCxzQ0FDSSxrQkFBc0MsRUFBRSxRQUFpQixFQUN6RCxVQUFtQjtRQUNyQixJQUFNLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqRCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2YsWUFBWSxDQUFDLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2IsWUFBWSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDL0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLDhCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFYRCxvRUFXQztJQUVELGlDQUF3QyxhQUFxQjtRQUMzRCwyRUFBMkU7UUFDM0UsMkVBQTJFO1FBQzNFLDJFQUEyRTtRQUMzRSwyRUFBMkU7UUFDM0UsTUFBTSxDQUFDLElBQUksOEJBQWlCLENBQUMsYUFBYSxDQUEyQixDQUFDO0lBQ3hFLENBQUM7SUFORCwwREFNQztJQUVELGtDQUF5QyxhQUFxQjtRQUM1RCxNQUFNLENBQUMsK0JBQWtCLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUZELDREQUVDO0lBaUJZLFFBQUEsa0JBQWtCLEdBQWlCO1FBQzlDLG9DQUFvQztRQUNwQyxVQUFVLGdCQUFJLENBQUM7S0FDaEIsQ0FBQztJQUVGO1FBSUUsNkJBQW9CLFFBQWdCO1lBQWhCLGFBQVEsR0FBUixRQUFRLENBQVE7WUFIcEMsaUVBQWlFO1lBQzFELGNBQVMsR0FBRyxJQUFJLCtCQUFrQixFQUFFLENBQUM7WUFHMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hCLDJEQUEyRDtnQkFDM0QsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO2dCQUM5QixTQUFTLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7Z0JBQy9CLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUTthQUN0QixDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsd0NBQVUsR0FBVixVQUFXLElBQWEsRUFBRSxRQUF3QixFQUFFLFNBQXlCLEVBQUUsTUFBYztZQUUzRixFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztvQkFDeEIsMkRBQTJEO29CQUMzRCxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUM7b0JBQzVELFNBQVMsRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBQztvQkFDL0QsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRO2lCQUN0QixDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztRQUNILDBCQUFDO0lBQUQsQ0FBQyxBQXhCRCxJQXdCQztJQXhCWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QmFzaWNTb3VyY2VNYXBDb25zdW1lciwgUmF3U291cmNlTWFwLCBTb3VyY2VNYXBDb25zdW1lciwgU291cmNlTWFwR2VuZXJhdG9yfSBmcm9tICdzb3VyY2UtbWFwJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJy4vdHlwZXNjcmlwdCc7XG5cbi8qKlxuICogUmV0dXJuIGEgbmV3IFJlZ0V4cCBvYmplY3QgZXZlcnkgdGltZSB3ZSB3YW50IG9uZSBiZWNhdXNlIHRoZVxuICogUmVnRXhwIG9iamVjdCBoYXMgaW50ZXJuYWwgc3RhdGUgdGhhdCB3ZSBkb24ndCB3YW50IHRvIHBlcnNpc3RcbiAqIGJldHdlZW4gZGlmZmVyZW50IGxvZ2ljYWwgdXNlcy5cbiAqL1xuZnVuY3Rpb24gZ2V0SW5saW5lU291cmNlTWFwUmVnZXgoKTogUmVnRXhwIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoJ14vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LCguKikkJywgJ21nJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250YWluc0lubGluZVNvdXJjZU1hcChzb3VyY2U6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gZ2V0SW5saW5lU291cmNlTWFwQ291bnQoc291cmNlKSA+IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmxpbmVTb3VyY2VNYXBDb3VudChzb3VyY2U6IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IG1hdGNoID0gc291cmNlLm1hdGNoKGdldElubGluZVNvdXJjZU1hcFJlZ2V4KCkpO1xuICByZXR1cm4gbWF0Y2ggPyBtYXRjaC5sZW5ndGggOiAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdElubGluZVNvdXJjZU1hcChzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGlubGluZVNvdXJjZU1hcFJlZ2V4ID0gZ2V0SW5saW5lU291cmNlTWFwUmVnZXgoKTtcbiAgbGV0IHByZXZpb3VzUmVzdWx0OiBSZWdFeHBFeGVjQXJyYXl8bnVsbCA9IG51bGw7XG4gIGxldCByZXN1bHQ6IFJlZ0V4cEV4ZWNBcnJheXxudWxsID0gbnVsbDtcbiAgLy8gV2Ugd2FudCB0byBleHRyYWN0IHRoZSBsYXN0IHNvdXJjZSBtYXAgaW4gdGhlIHNvdXJjZSBmaWxlXG4gIC8vIHNpbmNlIHRoYXQncyBwcm9iYWJseSB0aGUgbW9zdCByZWNlbnQgb25lIGFkZGVkLiAgV2Uga2VlcFxuICAvLyBtYXRjaGluZyBhZ2FpbnN0IHRoZSBzb3VyY2UgdW50aWwgd2UgZG9uJ3QgZ2V0IGEgcmVzdWx0LFxuICAvLyB0aGVuIHdlIHVzZSB0aGUgcHJldmlvdXMgcmVzdWx0LlxuICBkbyB7XG4gICAgcHJldmlvdXNSZXN1bHQgPSByZXN1bHQ7XG4gICAgcmVzdWx0ID0gaW5saW5lU291cmNlTWFwUmVnZXguZXhlYyhzb3VyY2UpO1xuICB9IHdoaWxlIChyZXN1bHQgIT09IG51bGwpO1xuICBjb25zdCBiYXNlNjRFbmNvZGVkTWFwID0gcHJldmlvdXNSZXN1bHQhWzFdO1xuICByZXR1cm4gQnVmZmVyLmZyb20oYmFzZTY0RW5jb2RlZE1hcCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCd1dGY4Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVJbmxpbmVTb3VyY2VNYXAoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc291cmNlLnJlcGxhY2UoZ2V0SW5saW5lU291cmNlTWFwUmVnZXgoKSwgJycpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHNvdXJjZSBtYXAgaW5saW5lIGluIHRoZSBmaWxlLiAgSWYgdGhlcmUncyBhbiBleGlzdGluZyBpbmxpbmUgc291cmNlXG4gKiBtYXAsIGl0IGNsb2JiZXJzIGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0SW5saW5lU291cmNlTWFwKHNvdXJjZTogc3RyaW5nLCBzb3VyY2VNYXA6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGVuY29kZWRTb3VyY2VNYXAgPSBCdWZmZXIuZnJvbShzb3VyY2VNYXAsICd1dGY4JykudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICBpZiAoY29udGFpbnNJbmxpbmVTb3VyY2VNYXAoc291cmNlKSkge1xuICAgIHJldHVybiBzb3VyY2UucmVwbGFjZShcbiAgICAgICAgZ2V0SW5saW5lU291cmNlTWFwUmVnZXgoKSxcbiAgICAgICAgYC8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsJHtlbmNvZGVkU291cmNlTWFwfWApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgJHtzb3VyY2V9XFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCwke2VuY29kZWRTb3VyY2VNYXB9YDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTb3VyY2VNYXAodGV4dDogc3RyaW5nLCBmaWxlTmFtZT86IHN0cmluZywgc291cmNlTmFtZT86IHN0cmluZyk6IFJhd1NvdXJjZU1hcCB7XG4gIGNvbnN0IHJhd1NvdXJjZU1hcCA9IEpTT04ucGFyc2UodGV4dCkgYXMgUmF3U291cmNlTWFwO1xuICBpZiAoc291cmNlTmFtZSkge1xuICAgIHJhd1NvdXJjZU1hcC5zb3VyY2VzID0gW3NvdXJjZU5hbWVdO1xuICB9XG4gIGlmIChmaWxlTmFtZSkge1xuICAgIHJhd1NvdXJjZU1hcC5maWxlID0gZmlsZU5hbWU7XG4gIH1cbiAgcmV0dXJuIHJhd1NvdXJjZU1hcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvdXJjZU1hcENvbnN1bWVyVG9HZW5lcmF0b3Ioc291cmNlTWFwQ29uc3VtZXI6IFNvdXJjZU1hcENvbnN1bWVyKTpcbiAgICBTb3VyY2VNYXBHZW5lcmF0b3Ige1xuICByZXR1cm4gU291cmNlTWFwR2VuZXJhdG9yLmZyb21Tb3VyY2VNYXAoc291cmNlTWFwQ29uc3VtZXIpO1xufVxuXG4vKipcbiAqIFRzYyBpZGVudGlmaWVzIHNvdXJjZSBmaWxlcyBieSB0aGVpciByZWxhdGl2ZSBwYXRoIHRvIHRoZSBvdXRwdXQgZmlsZS4gIFNpbmNlXG4gKiB0aGVyZSdzIG5vIGVhc3kgd2F5IHRvIGlkZW50aWZ5IHRoZXNlIHJlbGF0aXZlIHBhdGhzIHdoZW4gdHNpY2tsZSBnZW5lcmF0ZXMgaXRzXG4gKiBvd24gc291cmNlIG1hcHMsIHdlIHBhdGNoIHRoZW0gd2l0aCB0aGUgZmlsZSBuYW1lIGZyb20gdGhlIHRzYyBzb3VyY2UgbWFwc1xuICogYmVmb3JlIGNvbXBvc2luZyB0aGVtLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc291cmNlTWFwR2VuZXJhdG9yVG9Db25zdW1lcihcbiAgICBzb3VyY2VNYXBHZW5lcmF0b3I6IFNvdXJjZU1hcEdlbmVyYXRvciwgZmlsZU5hbWU/OiBzdHJpbmcsXG4gICAgc291cmNlTmFtZT86IHN0cmluZyk6IFNvdXJjZU1hcENvbnN1bWVyIHtcbiAgY29uc3QgcmF3U291cmNlTWFwID0gc291cmNlTWFwR2VuZXJhdG9yLnRvSlNPTigpO1xuICBpZiAoc291cmNlTmFtZSkge1xuICAgIHJhd1NvdXJjZU1hcC5zb3VyY2VzID0gW3NvdXJjZU5hbWVdO1xuICB9XG4gIGlmIChmaWxlTmFtZSkge1xuICAgIHJhd1NvdXJjZU1hcC5maWxlID0gZmlsZU5hbWU7XG4gIH1cbiAgcmV0dXJuIG5ldyBTb3VyY2VNYXBDb25zdW1lcihyYXdTb3VyY2VNYXApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc291cmNlTWFwVGV4dFRvQ29uc3VtZXIoc291cmNlTWFwVGV4dDogc3RyaW5nKTogQmFzaWNTb3VyY2VNYXBDb25zdW1lciB7XG4gIC8vIHRoZSBTb3VyY2VNYXBDb25zdW1lciBjb25zdHJ1Y3RvciByZXR1cm5zIGEgQmFzaWNTb3VyY2VNYXBDb25zdW1lciBvciBhblxuICAvLyBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIgZGVwZW5kaW5nIG9uIGlmIHlvdSBwYXNzIGluIGEgUmF3U291cmNlTWFwIG9yIGFcbiAgLy8gUmF3SW5kZXhNYXAgb3IgdGhlIHN0cmluZyBqc29uIG9mIGVpdGhlci4gIEluIHRoaXMgY2FzZSB3ZSdyZSBwYXNzaW5nIGluXG4gIC8vIHRoZSBzdHJpbmcgZm9yIGEgUmF3U291cmNlTWFwLCBzbyB3ZSBhbHdheXMgZ2V0IGEgQmFzaWNTb3VyY2VNYXBDb25zdW1lclxuICByZXR1cm4gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcFRleHQpIGFzIEJhc2ljU291cmNlTWFwQ29uc3VtZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzb3VyY2VNYXBUZXh0VG9HZW5lcmF0b3Ioc291cmNlTWFwVGV4dDogc3RyaW5nKTogU291cmNlTWFwR2VuZXJhdG9yIHtcbiAgcmV0dXJuIFNvdXJjZU1hcEdlbmVyYXRvci5mcm9tU291cmNlTWFwKHNvdXJjZU1hcFRleHRUb0NvbnN1bWVyKHNvdXJjZU1hcFRleHQpKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VQb3NpdGlvbiB7XG4gIC8vIDAgYmFzZWRcbiAgY29sdW1uOiBudW1iZXI7XG4gIC8vIDAgYmFzZWRcbiAgbGluZTogbnVtYmVyO1xuICAvLyAwIGJhc2VkXG4gIHBvc2l0aW9uOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU291cmNlTWFwcGVyIHtcbiAgYWRkTWFwcGluZyhcbiAgICAgIG9yaWdpbmFsTm9kZTogdHMuTm9kZSwgb3JpZ2luYWw6IFNvdXJjZVBvc2l0aW9uLCBnZW5lcmF0ZWQ6IFNvdXJjZVBvc2l0aW9uLFxuICAgICAgbGVuZ3RoOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgTk9PUF9TT1VSQ0VfTUFQUEVSOiBTb3VyY2VNYXBwZXIgPSB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1lbXB0eVxuICBhZGRNYXBwaW5nKCkge31cbn07XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0U291cmNlTWFwcGVyIGltcGxlbWVudHMgU291cmNlTWFwcGVyIHtcbiAgLyoqIFRoZSBzb3VyY2UgbWFwIHRoYXQncyBnZW5lcmF0ZWQgd2hpbGUgcmV3cml0aW5nIHRoaXMgZmlsZS4gKi9cbiAgcHVibGljIHNvdXJjZU1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNvdXJjZU1hcC5hZGRNYXBwaW5nKHtcbiAgICAgIC8vIHRzYydzIHNvdXJjZSBtYXBzIHVzZSAxLWluZGV4ZWQgbGluZXMsIDAtaW5kZXhlZCBjb2x1bW5zXG4gICAgICBvcmlnaW5hbDoge2xpbmU6IDEsIGNvbHVtbjogMH0sXG4gICAgICBnZW5lcmF0ZWQ6IHtsaW5lOiAxLCBjb2x1bW46IDB9LFxuICAgICAgc291cmNlOiB0aGlzLmZpbGVOYW1lLFxuICAgIH0pO1xuICB9XG5cbiAgYWRkTWFwcGluZyhub2RlOiB0cy5Ob2RlLCBvcmlnaW5hbDogU291cmNlUG9zaXRpb24sIGdlbmVyYXRlZDogU291cmNlUG9zaXRpb24sIGxlbmd0aDogbnVtYmVyKTpcbiAgICAgIHZvaWQge1xuICAgIGlmIChsZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnNvdXJjZU1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgLy8gdHNjJ3Mgc291cmNlIG1hcHMgdXNlIDEtaW5kZXhlZCBsaW5lcywgMC1pbmRleGVkIGNvbHVtbnNcbiAgICAgICAgb3JpZ2luYWw6IHtsaW5lOiBvcmlnaW5hbC5saW5lICsgMSwgY29sdW1uOiBvcmlnaW5hbC5jb2x1bW59LFxuICAgICAgICBnZW5lcmF0ZWQ6IHtsaW5lOiBnZW5lcmF0ZWQubGluZSArIDEsIGNvbHVtbjogZ2VuZXJhdGVkLmNvbHVtbn0sXG4gICAgICAgIHNvdXJjZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19