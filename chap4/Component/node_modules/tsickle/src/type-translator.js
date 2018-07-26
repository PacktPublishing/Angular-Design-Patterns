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
        define("tsickle/src/type-translator", ["require", "exports", "path", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var path = require("path");
    var ts = require("typescript");
    /**
     * Determines if fileName refers to a builtin lib.d.ts file.
     * This is a terrible hack but it mirrors a similar thing done in Clutz.
     */
    function isBuiltinLibDTS(fileName) {
        return fileName.match(/\blib\.(?:[^/]+\.)?d\.ts$/) != null;
    }
    exports.isBuiltinLibDTS = isBuiltinLibDTS;
    /**
     * @return True if the named type is considered compatible with the Closure-defined
     *     type of the same name, e.g. "Array".  Note that we don't actually enforce
     *     that the types are actually compatible, but mostly just hope that they are due
     *     to being derived from the same HTML specs.
     */
    function isClosureProvidedType(symbol) {
        return symbol.declarations != null &&
            symbol.declarations.some(function (n) { return isBuiltinLibDTS(n.getSourceFile().fileName); });
    }
    function typeToDebugString(type) {
        var debugString = "flags:0x" + type.flags.toString(16);
        // Just the unique flags (powers of two). Declared in src/compiler/types.ts.
        var basicTypes = [
            ts.TypeFlags.Any, ts.TypeFlags.String, ts.TypeFlags.Number,
            ts.TypeFlags.Boolean, ts.TypeFlags.Enum, ts.TypeFlags.StringLiteral,
            ts.TypeFlags.NumberLiteral, ts.TypeFlags.BooleanLiteral, ts.TypeFlags.EnumLiteral,
            ts.TypeFlags.ESSymbol, ts.TypeFlags.Void, ts.TypeFlags.Undefined,
            ts.TypeFlags.Null, ts.TypeFlags.Never, ts.TypeFlags.TypeParameter,
            ts.TypeFlags.Object, ts.TypeFlags.Union, ts.TypeFlags.Intersection,
            ts.TypeFlags.Index, ts.TypeFlags.IndexedAccess, ts.TypeFlags.NonPrimitive,
        ];
        try {
            for (var basicTypes_1 = __values(basicTypes), basicTypes_1_1 = basicTypes_1.next(); !basicTypes_1_1.done; basicTypes_1_1 = basicTypes_1.next()) {
                var flag = basicTypes_1_1.value;
                if ((type.flags & flag) !== 0) {
                    debugString += " " + ts.TypeFlags[flag];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (basicTypes_1_1 && !basicTypes_1_1.done && (_a = basicTypes_1.return)) _a.call(basicTypes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (type.flags === ts.TypeFlags.Object) {
            var objType = type;
            // Just the unique flags (powers of two). Declared in src/compiler/types.ts.
            var objectFlags = [
                ts.ObjectFlags.Class,
                ts.ObjectFlags.Interface,
                ts.ObjectFlags.Reference,
                ts.ObjectFlags.Tuple,
                ts.ObjectFlags.Anonymous,
                ts.ObjectFlags.Mapped,
                ts.ObjectFlags.Instantiated,
                ts.ObjectFlags.ObjectLiteral,
                ts.ObjectFlags.EvolvingArray,
                ts.ObjectFlags.ObjectLiteralPatternWithComputedProperties,
            ];
            try {
                for (var objectFlags_1 = __values(objectFlags), objectFlags_1_1 = objectFlags_1.next(); !objectFlags_1_1.done; objectFlags_1_1 = objectFlags_1.next()) {
                    var flag = objectFlags_1_1.value;
                    if ((objType.objectFlags & flag) !== 0) {
                        debugString += " object:" + ts.ObjectFlags[flag];
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (objectFlags_1_1 && !objectFlags_1_1.done && (_b = objectFlags_1.return)) _b.call(objectFlags_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (type.symbol && type.symbol.name !== '__type') {
            debugString += " symbol.name:" + JSON.stringify(type.symbol.name);
        }
        if (type.pattern) {
            debugString += " destructuring:true";
        }
        return "{type " + debugString + "}";
        var e_1, _a, e_2, _b;
    }
    exports.typeToDebugString = typeToDebugString;
    function symbolToDebugString(sym) {
        var debugString = JSON.stringify(sym.name) + " flags:0x" + sym.flags.toString(16);
        // Just the unique flags (powers of two). Declared in src/compiler/types.ts.
        var symbolFlags = [
            ts.SymbolFlags.FunctionScopedVariable,
            ts.SymbolFlags.BlockScopedVariable,
            ts.SymbolFlags.Property,
            ts.SymbolFlags.EnumMember,
            ts.SymbolFlags.Function,
            ts.SymbolFlags.Class,
            ts.SymbolFlags.Interface,
            ts.SymbolFlags.ConstEnum,
            ts.SymbolFlags.RegularEnum,
            ts.SymbolFlags.ValueModule,
            ts.SymbolFlags.NamespaceModule,
            ts.SymbolFlags.TypeLiteral,
            ts.SymbolFlags.ObjectLiteral,
            ts.SymbolFlags.Method,
            ts.SymbolFlags.Constructor,
            ts.SymbolFlags.GetAccessor,
            ts.SymbolFlags.SetAccessor,
            ts.SymbolFlags.Signature,
            ts.SymbolFlags.TypeParameter,
            ts.SymbolFlags.TypeAlias,
            ts.SymbolFlags.ExportValue,
            ts.SymbolFlags.Alias,
            ts.SymbolFlags.Prototype,
            ts.SymbolFlags.ExportStar,
            ts.SymbolFlags.Optional,
            ts.SymbolFlags.Transient,
        ];
        try {
            for (var symbolFlags_1 = __values(symbolFlags), symbolFlags_1_1 = symbolFlags_1.next(); !symbolFlags_1_1.done; symbolFlags_1_1 = symbolFlags_1.next()) {
                var flag = symbolFlags_1_1.value;
                if ((sym.flags & flag) !== 0) {
                    debugString += " " + ts.SymbolFlags[flag];
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (symbolFlags_1_1 && !symbolFlags_1_1.done && (_a = symbolFlags_1.return)) _a.call(symbolFlags_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return debugString;
        var e_3, _a;
    }
    exports.symbolToDebugString = symbolToDebugString;
    /** TypeTranslator translates TypeScript types to Closure types. */
    var TypeTranslator = /** @class */ (function () {
        /**
         * @param node is the source AST ts.Node the type comes from.  This is used
         *     in some cases (e.g. anonymous types) for looking up field names.
         * @param pathBlackList is a set of paths that should never get typed;
         *     any reference to symbols defined in these paths should by typed
         *     as {?}.
         * @param symbolsToAliasedNames a mapping from symbols (`Foo`) to a name in scope they should be
         *     emitted as (e.g. `tsickle_forward_declare_1.Foo`).
         */
        function TypeTranslator(typeChecker, node, pathBlackList, symbolsToAliasedNames) {
            if (symbolsToAliasedNames === void 0) { symbolsToAliasedNames = new Map(); }
            this.typeChecker = typeChecker;
            this.node = node;
            this.pathBlackList = pathBlackList;
            this.symbolsToAliasedNames = symbolsToAliasedNames;
            /**
             * A list of types we've encountered while emitting; used to avoid getting stuck in recursive
             * types.
             */
            this.seenTypes = [];
            /**
             * Whether to write types suitable for an \@externs file. Externs types must not refer to
             * non-externs types (i.e. non ambient types) and need to use fully qualified names.
             */
            this.isForExterns = false;
            // Normalize paths to not break checks on Windows.
            if (this.pathBlackList != null) {
                this.pathBlackList =
                    new Set(Array.from(this.pathBlackList.values()).map(function (p) { return path.normalize(p); }));
            }
        }
        /**
         * Converts a ts.Symbol to a string.
         * Other approaches that don't work:
         * - TypeChecker.typeToString translates Array as T[].
         * - TypeChecker.symbolToString emits types without their namespace,
         *   and doesn't let you pass the flag to control that.
         * @param useFqn whether to scope the name using its fully qualified name. Closure's template
         *     arguments are always scoped to the class containing them, where TypeScript's template args
         *     would be fully qualified. I.e. this flag is false for generic types.
         */
        TypeTranslator.prototype.symbolToString = function (sym, useFqn) {
            // This follows getSingleLineStringWriter in the TypeScript compiler.
            var str = '';
            var symAlias = sym;
            if (symAlias.flags & ts.SymbolFlags.Alias) {
                symAlias = this.typeChecker.getAliasedSymbol(symAlias);
            }
            var alias = this.symbolsToAliasedNames.get(symAlias);
            if (alias)
                return alias;
            if (useFqn && this.isForExterns) {
                // For regular type emit, we can use TypeScript's naming rules, as they match Closure's name
                // scoping rules. However when emitting externs files for ambients, naming rules change. As
                // Closure doesn't support externs modules, all names must be global and use global fully
                // qualified names. The code below uses TypeScript to convert a symbol to a full qualified
                // name and then emits that.
                var fqn = this.typeChecker.getFullyQualifiedName(sym);
                if (fqn.startsWith("\"") || fqn.startsWith("'")) {
                    // Quoted FQNs mean the name is from a module, e.g. `'path/to/module'.some.qualified.Name`.
                    // tsickle generally re-scopes names in modules that are moved to externs into the global
                    // namespace. That does not quite match TS' semantics where ambient types from modules are
                    // local. However value declarations that are local to modules but not defined do not make
                    // sense if not global, e.g. "declare class X {}; new X();" cannot work unless `X` is
                    // actually a global.
                    // So this code strips the module path from the type and uses the FQN as a global.
                    fqn = fqn.replace(/^["'][^"']+['"]\./, '');
                }
                // Declarations in module can re-open global types using "declare global { ... }". The fqn
                // then contains the prefix "global." here. As we're mapping to global types, just strip the
                // prefix.
                var isInGlobal = (sym.declarations || []).some(function (d) {
                    var current = d;
                    while (current) {
                        if (current.flags & ts.NodeFlags.GlobalAugmentation)
                            return true;
                        current = current.parent;
                    }
                    return false;
                });
                if (isInGlobal) {
                    fqn = fqn.replace(/^global\./, '');
                }
                return this.stripClutzNamespace(fqn);
            }
            var writeText = function (text) { return str += text; };
            var doNothing = function () {
                return;
            };
            var builder = this.typeChecker.getSymbolDisplayBuilder();
            var writer = {
                writeKeyword: writeText,
                writeOperator: writeText,
                writePunctuation: writeText,
                writeSpace: writeText,
                writeStringLiteral: writeText,
                writeParameter: writeText,
                writeProperty: writeText,
                writeSymbol: writeText,
                writeLine: doNothing,
                increaseIndent: doNothing,
                decreaseIndent: doNothing,
                clear: doNothing,
                trackSymbol: function (symbol, enclosingDeclaration, meaning) {
                    return;
                },
                reportInaccessibleThisError: doNothing,
                reportPrivateInBaseOfClassExpression: doNothing,
            };
            builder.buildSymbolDisplay(sym, writer, this.node);
            return this.stripClutzNamespace(str);
        };
        // Clutz (https://github.com/angular/clutz) emits global type symbols hidden in a special
        // ಠ_ಠ.clutz namespace. While most code seen by Tsickle will only ever see local aliases, Clutz
        // symbols can be written by users directly in code, and they can appear by dereferencing
        // TypeAliases. The code below simply strips the prefix, the remaining type name then matches
        // Closure's type.
        TypeTranslator.prototype.stripClutzNamespace = function (name) {
            if (name.startsWith('ಠ_ಠ.clutz.'))
                return name.substring('ಠ_ಠ.clutz.'.length);
            return name;
        };
        TypeTranslator.prototype.translate = function (type) {
            // NOTE: Though type.flags has the name "flags", it usually can only be one
            // of the enum options at a time (except for unions of literal types, e.g. unions of boolean
            // values, string values, enum values). This switch handles all the cases in the ts.TypeFlags
            // enum in the order they occur.
            // NOTE: Some TypeFlags are marked "internal" in the d.ts but still show up in the value of
            // type.flags. This mask limits the flag checks to the ones in the public API. "lastFlag" here
            // is the last flag handled in this switch statement, and should be kept in sync with
            // typescript.d.ts.
            // NonPrimitive occurs on its own on the lower case "object" type. Special case to "!Object".
            if (type.flags === ts.TypeFlags.NonPrimitive)
                return '!Object';
            var isAmbient = false;
            var isNamespace = false;
            var isModule = false;
            if (type.symbol) {
                try {
                    for (var _a = __values(type.symbol.declarations || []), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var decl = _b.value;
                        if (ts.isExternalModule(decl.getSourceFile()))
                            isModule = true;
                        var current = decl;
                        while (current) {
                            if (ts.getCombinedModifierFlags(current) & ts.ModifierFlags.Ambient)
                                isAmbient = true;
                            if (current.kind === ts.SyntaxKind.ModuleDeclaration)
                                isNamespace = true;
                            current = current.parent;
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
            // tsickle cannot generate types for non-ambient namespaces.
            if (isNamespace && !isAmbient)
                return '?';
            // Types in externs cannot reference types from external modules.
            // However ambient types in modules get moved to externs, too, so type references work and we
            // can emit a precise type.
            if (this.isForExterns && isModule && !isAmbient)
                return '?';
            var lastFlag = ts.TypeFlags.IndexedAccess;
            var mask = (lastFlag << 1) - 1;
            switch (type.flags & mask) {
                case ts.TypeFlags.Any:
                    return '?';
                case ts.TypeFlags.String:
                case ts.TypeFlags.StringLiteral:
                    return 'string';
                case ts.TypeFlags.Number:
                case ts.TypeFlags.NumberLiteral:
                    return 'number';
                case ts.TypeFlags.Boolean:
                case ts.TypeFlags.BooleanLiteral:
                    // See the note in translateUnion about booleans.
                    return 'boolean';
                case ts.TypeFlags.Enum:
                    if (!type.symbol) {
                        this.warn("EnumType without a symbol");
                        return '?';
                    }
                    return this.symbolToString(type.symbol, true);
                case ts.TypeFlags.ESSymbol:
                    // NOTE: currently this is just a typedef for {?}, shrug.
                    // https://github.com/google/closure-compiler/blob/55cf43ee31e80d89d7087af65b5542aa63987874/externs/es3.js#L34
                    return 'symbol';
                case ts.TypeFlags.Void:
                    return 'void';
                case ts.TypeFlags.Undefined:
                    return 'undefined';
                case ts.TypeFlags.Null:
                    return 'null';
                case ts.TypeFlags.Never:
                    this.warn("should not emit a 'never' type");
                    return '?';
                case ts.TypeFlags.TypeParameter:
                    // This is e.g. the T in a type like Foo<T>.
                    if (!type.symbol) {
                        this.warn("TypeParameter without a symbol"); // should not happen (tm)
                        return '?';
                    }
                    // In Closure Compiler, type parameters *are* scoped to their containing class.
                    var useFqn = false;
                    return this.symbolToString(type.symbol, useFqn);
                case ts.TypeFlags.Object:
                    return this.translateObject(type);
                case ts.TypeFlags.Union:
                    return this.translateUnion(type);
                case ts.TypeFlags.Intersection:
                case ts.TypeFlags.Index:
                case ts.TypeFlags.IndexedAccess:
                    // TODO(ts2.1): handle these special types.
                    this.warn("unhandled type flags: " + ts.TypeFlags[type.flags]);
                    return '?';
                default:
                    // Handle cases where multiple flags are set.
                    // Types with literal members are represented as
                    //   ts.TypeFlags.Union | [literal member]
                    // E.g. an enum typed value is a union type with the enum's members as its members. A
                    // boolean type is a union type with 'true' and 'false' as its members.
                    // Note also that in a more complex union, e.g. boolean|number, then it's a union of three
                    // things (true|false|number) and ts.TypeFlags.Boolean doesn't show up at all.
                    if (type.flags & ts.TypeFlags.Union) {
                        return this.translateUnion(type);
                    }
                    if (type.flags & ts.TypeFlags.EnumLiteral) {
                        return this.translateEnumLiteral(type);
                    }
                    // The switch statement should have been exhaustive.
                    throw new Error("unknown type flags " + type.flags + " on " + typeToDebugString(type));
            }
            var e_4, _c;
        };
        TypeTranslator.prototype.translateUnion = function (type) {
            var _this = this;
            var parts = type.types.map(function (t) { return _this.translate(t); });
            // Union types that include literals (e.g. boolean, enum) can end up repeating the same Closure
            // type. For example: true | boolean will be translated to boolean | boolean.
            // Remove duplicates to produce types that read better.
            parts = parts.filter(function (el, idx) { return parts.indexOf(el) === idx; });
            return parts.length === 1 ? parts[0] : "(" + parts.join('|') + ")";
        };
        TypeTranslator.prototype.translateEnumLiteral = function (type) {
            // Suppose you had:
            //   enum EnumType { MEMBER }
            // then the type of "EnumType.MEMBER" is an enum literal (the thing passed to this function)
            // and it has type flags that include
            //   ts.TypeFlags.NumberLiteral | ts.TypeFlags.EnumLiteral
            //
            // Closure Compiler doesn't support literals in types, so this code must not emit
            // "EnumType.MEMBER", but rather "EnumType".
            var enumLiteralBaseType = this.typeChecker.getBaseTypeOfLiteralType(type);
            if (!enumLiteralBaseType.symbol) {
                this.warn("EnumLiteralType without a symbol");
                return '?';
            }
            return this.symbolToString(enumLiteralBaseType.symbol, true);
        };
        // translateObject translates a ts.ObjectType, which is the type of all
        // object-like things in TS, such as classes and interfaces.
        TypeTranslator.prototype.translateObject = function (type) {
            var _this = this;
            if (type.symbol && this.isBlackListed(type.symbol))
                return '?';
            // NOTE: objectFlags is an enum, but a given type can have multiple flags.
            // Array<string> is both ts.ObjectFlags.Reference and ts.ObjectFlags.Interface.
            if (type.objectFlags & ts.ObjectFlags.Class) {
                if (!type.symbol) {
                    this.warn('class has no symbol');
                    return '?';
                }
                return '!' + this.symbolToString(type.symbol, /* useFqn */ true);
            }
            else if (type.objectFlags & ts.ObjectFlags.Interface) {
                // Note: ts.InterfaceType has a typeParameters field, but that
                // specifies the parameters that the interface type *expects*
                // when it's used, and should not be transformed to the output.
                // E.g. a type like Array<number> is a TypeReference to the
                // InterfaceType "Array", but the "number" type parameter is
                // part of the outer TypeReference, not a typeParameter on
                // the InterfaceType.
                if (!type.symbol) {
                    this.warn('interface has no symbol');
                    return '?';
                }
                if (type.symbol.flags & ts.SymbolFlags.Value) {
                    // The symbol is both a type and a value.
                    // For user-defined types in this state, we don't have a Closure name
                    // for the type.  See the type_and_value test.
                    if (!isClosureProvidedType(type.symbol)) {
                        this.warn("type/symbol conflict for " + type.symbol.name + ", using {?} for now");
                        return '?';
                    }
                }
                return '!' + this.symbolToString(type.symbol, /* useFqn */ true);
            }
            else if (type.objectFlags & ts.ObjectFlags.Reference) {
                // A reference to another type, e.g. Array<number> refers to Array.
                // Emit the referenced type and any type arguments.
                var referenceType = type;
                // A tuple is a ReferenceType where the target is flagged Tuple and the
                // typeArguments are the tuple arguments.  Just treat it as a mystery
                // array, because Closure doesn't understand tuples.
                if (referenceType.target.objectFlags & ts.ObjectFlags.Tuple) {
                    return '!Array<?>';
                }
                var typeStr = '';
                if (referenceType.target === referenceType) {
                    // We get into an infinite loop here if the inner reference is
                    // the same as the outer; this can occur when this function
                    // fails to translate a more specific type before getting to
                    // this point.
                    throw new Error("reference loop in " + typeToDebugString(referenceType) + " " + referenceType.flags);
                }
                typeStr += this.translate(referenceType.target);
                // Translate can return '?' for a number of situations, e.g. type/value conflicts.
                // `?<?>` is illegal syntax in Closure Compiler, so just return `?` here.
                if (typeStr === '?')
                    return '?';
                if (referenceType.typeArguments) {
                    var params = referenceType.typeArguments.map(function (t) { return _this.translate(t); });
                    typeStr += "<" + params.join(', ') + ">";
                }
                return typeStr;
            }
            else if (type.objectFlags & ts.ObjectFlags.Anonymous) {
                if (!type.symbol) {
                    // This comes up when generating code for an arrow function as passed
                    // to a generic function.  The passed-in type is tagged as anonymous
                    // and has no properties so it's hard to figure out what to generate.
                    // Just avoid it for now so we don't crash.
                    this.warn('anonymous type has no symbol');
                    return '?';
                }
                if (type.symbol.flags & ts.SymbolFlags.TypeLiteral) {
                    return this.translateTypeLiteral(type);
                }
                else if (type.symbol.flags & ts.SymbolFlags.Function ||
                    type.symbol.flags & ts.SymbolFlags.Method) {
                    var sigs = this.typeChecker.getSignaturesOfType(type, ts.SignatureKind.Call);
                    if (sigs.length === 1) {
                        return this.signatureToClosure(sigs[0]);
                    }
                }
                this.warn('unhandled anonymous type');
                return '?';
            }
            /*
            TODO(ts2.1): more unhandled object type flags:
              Tuple
              Mapped
              Instantiated
              ObjectLiteral
              EvolvingArray
              ObjectLiteralPatternWithComputedProperties
            */
            this.warn("unhandled type " + typeToDebugString(type));
            return '?';
        };
        /**
         * translateTypeLiteral translates a ts.SymbolFlags.TypeLiteral type, which
         * is the anonymous type encountered in e.g.
         *   let x: {a: number};
         */
        TypeTranslator.prototype.translateTypeLiteral = function (type) {
            // Avoid infinite loops on recursive types.
            // It would be nice to just emit the name of the recursive type here,
            // but type.symbol doesn't seem to have the name here (perhaps something
            // to do with aliases?).
            if (this.seenTypes.indexOf(type) !== -1)
                return '?';
            this.seenTypes.push(type);
            // Gather up all the named fields and whether the object is also callable.
            var callable = false;
            var indexable = false;
            var fields = [];
            if (!type.symbol || !type.symbol.members) {
                this.warn('type literal has no symbol');
                return '?';
            }
            // special-case construct signatures.
            var ctors = type.getConstructSignatures();
            if (ctors.length) {
                // TODO(martinprobst): this does not support additional properties defined on constructors
                // (not expressible in Closure), nor multiple constructors (same).
                var params = this.convertParams(ctors[0]);
                var paramsStr = params.length ? (', ' + params.join(', ')) : '';
                var constructedType = this.translate(ctors[0].getReturnType());
                // In the specific case of the "new" in a function, it appears that
                //   function(new: !Bar)
                // fails to parse, while
                //   function(new: (!Bar))
                // parses in the way you'd expect.
                // It appears from testing that Closure ignores the ! anyway and just
                // assumes the result will be non-null in either case.  (To be pedantic,
                // it's possible to return null from a ctor it seems like a bad idea.)
                return "function(new: (" + constructedType + ")" + paramsStr + "): ?";
            }
            try {
                // members is an ES6 map, but the .d.ts defining it defined their own map
                // type, so typescript doesn't believe that .keys() is iterable
                // tslint:disable-next-line:no-any
                for (var _a = __values(type.symbol.members.keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var field = _b.value;
                    switch (field) {
                        case '__call':
                            callable = true;
                            break;
                        case '__index':
                            indexable = true;
                            break;
                        default:
                            var member = type.symbol.members.get(field);
                            // optional members are handled by the type including |undefined in a union type.
                            var memberType = this.translate(this.typeChecker.getTypeOfSymbolAtLocation(member, this.node));
                            fields.push(field + ": " + memberType);
                            break;
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_5) throw e_5.error; }
            }
            // Try to special-case plain key-value objects and functions.
            if (fields.length === 0) {
                if (callable && !indexable) {
                    // A function type.
                    var sigs = this.typeChecker.getSignaturesOfType(type, ts.SignatureKind.Call);
                    if (sigs.length === 1) {
                        return this.signatureToClosure(sigs[0]);
                    }
                }
                else if (indexable && !callable) {
                    // A plain key-value map type.
                    var keyType = 'string';
                    var valType = this.typeChecker.getIndexTypeOfType(type, ts.IndexKind.String);
                    if (!valType) {
                        keyType = 'number';
                        valType = this.typeChecker.getIndexTypeOfType(type, ts.IndexKind.Number);
                    }
                    if (!valType) {
                        this.warn('unknown index key type');
                        return "!Object<?,?>";
                    }
                    return "!Object<" + keyType + "," + this.translate(valType) + ">";
                }
                else if (!callable && !indexable) {
                    // Special-case the empty object {} because Closure doesn't like it.
                    // TODO(evanm): revisit this if it is a problem.
                    return '!Object';
                }
            }
            if (!callable && !indexable) {
                // Not callable, not indexable; implies a plain object with fields in it.
                return "{" + fields.join(', ') + "}";
            }
            this.warn('unhandled type literal');
            return '?';
            var e_5, _c;
        };
        /** Converts a ts.Signature (function signature) to a Closure function type. */
        TypeTranslator.prototype.signatureToClosure = function (sig) {
            // TODO(martinprobst): Consider harmonizing some overlap with emitFunctionType in tsickle.ts.
            var params = this.convertParams(sig);
            var typeStr = "function(" + params.join(', ') + ")";
            var retType = this.translate(this.typeChecker.getReturnTypeOfSignature(sig));
            if (retType) {
                typeStr += ": " + retType;
            }
            return typeStr;
        };
        TypeTranslator.prototype.convertParams = function (sig) {
            var paramTypes = [];
            // The Signature itself does not include information on optional and var arg parameters.
            // Use its declaration to recover that information.
            var decl = sig.declaration;
            for (var i = 0; i < sig.parameters.length; i++) {
                var param = sig.parameters[i];
                var paramDecl = decl.parameters[i];
                var optional = !!paramDecl.questionToken;
                var varArgs = !!paramDecl.dotDotDotToken;
                var paramType = this.typeChecker.getTypeOfSymbolAtLocation(param, this.node);
                if (varArgs) {
                    var typeRef = paramType;
                    paramType = typeRef.typeArguments[0];
                }
                var typeStr = this.translate(paramType);
                if (varArgs)
                    typeStr = '...' + typeStr;
                if (optional)
                    typeStr = typeStr + '=';
                paramTypes.push(typeStr);
            }
            return paramTypes;
        };
        TypeTranslator.prototype.warn = function (msg) {
            // By default, warn() does nothing.  The caller will overwrite this
            // if it wants different behavior.
        };
        /** @return true if sym should always have type {?}. */
        TypeTranslator.prototype.isBlackListed = function (symbol) {
            if (this.pathBlackList === undefined)
                return false;
            var pathBlackList = this.pathBlackList;
            // Some builtin types, such as {}, get represented by a symbol that has no declarations.
            if (symbol.declarations === undefined)
                return false;
            return symbol.declarations.every(function (n) {
                var fileName = path.normalize(n.getSourceFile().fileName);
                return pathBlackList.has(fileName);
            });
        };
        return TypeTranslator;
    }());
    exports.TypeTranslator = TypeTranslator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS10cmFuc2xhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3R5cGUtdHJhbnNsYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFSCwyQkFBNkI7SUFDN0IsK0JBQWlDO0lBRWpDOzs7T0FHRztJQUNILHlCQUFnQyxRQUFnQjtRQUM5QyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLElBQUksQ0FBQztJQUM3RCxDQUFDO0lBRkQsMENBRUM7SUFFRDs7Ozs7T0FLRztJQUNILCtCQUErQixNQUFpQjtRQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxJQUFJO1lBQzlCLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsZUFBZSxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBM0MsQ0FBMkMsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCwyQkFBa0MsSUFBYTtRQUM3QyxJQUFJLFdBQVcsR0FBRyxhQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBRyxDQUFDO1FBRXZELDRFQUE0RTtRQUM1RSxJQUFNLFVBQVUsR0FBbUI7WUFDakMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNO1lBQzVFLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUMsYUFBYTtZQUNuRixFQUFFLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsU0FBUyxD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cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBmaWxlTmFtZSByZWZlcnMgdG8gYSBidWlsdGluIGxpYi5kLnRzIGZpbGUuXG4gKiBUaGlzIGlzIGEgdGVycmlibGUgaGFjayBidXQgaXQgbWlycm9ycyBhIHNpbWlsYXIgdGhpbmcgZG9uZSBpbiBDbHV0ei5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQnVpbHRpbkxpYkRUUyhmaWxlTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBmaWxlTmFtZS5tYXRjaCgvXFxibGliXFwuKD86W14vXStcXC4pP2RcXC50cyQvKSAhPSBudWxsO1xufVxuXG4vKipcbiAqIEByZXR1cm4gVHJ1ZSBpZiB0aGUgbmFtZWQgdHlwZSBpcyBjb25zaWRlcmVkIGNvbXBhdGlibGUgd2l0aCB0aGUgQ2xvc3VyZS1kZWZpbmVkXG4gKiAgICAgdHlwZSBvZiB0aGUgc2FtZSBuYW1lLCBlLmcuIFwiQXJyYXlcIi4gIE5vdGUgdGhhdCB3ZSBkb24ndCBhY3R1YWxseSBlbmZvcmNlXG4gKiAgICAgdGhhdCB0aGUgdHlwZXMgYXJlIGFjdHVhbGx5IGNvbXBhdGlibGUsIGJ1dCBtb3N0bHkganVzdCBob3BlIHRoYXQgdGhleSBhcmUgZHVlXG4gKiAgICAgdG8gYmVpbmcgZGVyaXZlZCBmcm9tIHRoZSBzYW1lIEhUTUwgc3BlY3MuXG4gKi9cbmZ1bmN0aW9uIGlzQ2xvc3VyZVByb3ZpZGVkVHlwZShzeW1ib2w6IHRzLlN5bWJvbCk6IGJvb2xlYW4ge1xuICByZXR1cm4gc3ltYm9sLmRlY2xhcmF0aW9ucyAhPSBudWxsICYmXG4gICAgICBzeW1ib2wuZGVjbGFyYXRpb25zLnNvbWUobiA9PiBpc0J1aWx0aW5MaWJEVFMobi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVUb0RlYnVnU3RyaW5nKHR5cGU6IHRzLlR5cGUpOiBzdHJpbmcge1xuICBsZXQgZGVidWdTdHJpbmcgPSBgZmxhZ3M6MHgke3R5cGUuZmxhZ3MudG9TdHJpbmcoMTYpfWA7XG5cbiAgLy8gSnVzdCB0aGUgdW5pcXVlIGZsYWdzIChwb3dlcnMgb2YgdHdvKS4gRGVjbGFyZWQgaW4gc3JjL2NvbXBpbGVyL3R5cGVzLnRzLlxuICBjb25zdCBiYXNpY1R5cGVzOiB0cy5UeXBlRmxhZ3NbXSA9IFtcbiAgICB0cy5UeXBlRmxhZ3MuQW55LCAgICAgICAgICAgdHMuVHlwZUZsYWdzLlN0cmluZywgICAgICAgICB0cy5UeXBlRmxhZ3MuTnVtYmVyLFxuICAgIHRzLlR5cGVGbGFncy5Cb29sZWFuLCAgICAgICB0cy5UeXBlRmxhZ3MuRW51bSwgICAgICAgICAgIHRzLlR5cGVGbGFncy5TdHJpbmdMaXRlcmFsLFxuICAgIHRzLlR5cGVGbGFncy5OdW1iZXJMaXRlcmFsLCB0cy5UeXBlRmxhZ3MuQm9vbGVhbkxpdGVyYWwsIHRzLlR5cGVGbGFncy5FbnVtTGl0ZXJhbCxcbiAgICB0cy5UeXBlRmxhZ3MuRVNTeW1ib2wsICAgICAgdHMuVHlwZUZsYWdzLlZvaWQsICAgICAgICAgICB0cy5UeXBlRmxhZ3MuVW5kZWZpbmVkLFxuICAgIHRzLlR5cGVGbGFncy5OdWxsLCAgICAgICAgICB0cy5UeXBlRmxhZ3MuTmV2ZXIsICAgICAgICAgIHRzLlR5cGVGbGFncy5UeXBlUGFyYW1ldGVyLFxuICAgIHRzLlR5cGVGbGFncy5PYmplY3QsICAgICAgICB0cy5UeXBlRmxhZ3MuVW5pb24sICAgICAgICAgIHRzLlR5cGVGbGFncy5JbnRlcnNlY3Rpb24sXG4gICAgdHMuVHlwZUZsYWdzLkluZGV4LCAgICAgICAgIHRzLlR5cGVGbGFncy5JbmRleGVkQWNjZXNzLCAgdHMuVHlwZUZsYWdzLk5vblByaW1pdGl2ZSxcbiAgXTtcbiAgZm9yIChjb25zdCBmbGFnIG9mIGJhc2ljVHlwZXMpIHtcbiAgICBpZiAoKHR5cGUuZmxhZ3MgJiBmbGFnKSAhPT0gMCkge1xuICAgICAgZGVidWdTdHJpbmcgKz0gYCAke3RzLlR5cGVGbGFnc1tmbGFnXX1gO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlLmZsYWdzID09PSB0cy5UeXBlRmxhZ3MuT2JqZWN0KSB7XG4gICAgY29uc3Qgb2JqVHlwZSA9IHR5cGUgYXMgdHMuT2JqZWN0VHlwZTtcbiAgICAvLyBKdXN0IHRoZSB1bmlxdWUgZmxhZ3MgKHBvd2VycyBvZiB0d28pLiBEZWNsYXJlZCBpbiBzcmMvY29tcGlsZXIvdHlwZXMudHMuXG4gICAgY29uc3Qgb2JqZWN0RmxhZ3M6IHRzLk9iamVjdEZsYWdzW10gPSBbXG4gICAgICB0cy5PYmplY3RGbGFncy5DbGFzcyxcbiAgICAgIHRzLk9iamVjdEZsYWdzLkludGVyZmFjZSxcbiAgICAgIHRzLk9iamVjdEZsYWdzLlJlZmVyZW5jZSxcbiAgICAgIHRzLk9iamVjdEZsYWdzLlR1cGxlLFxuICAgICAgdHMuT2JqZWN0RmxhZ3MuQW5vbnltb3VzLFxuICAgICAgdHMuT2JqZWN0RmxhZ3MuTWFwcGVkLFxuICAgICAgdHMuT2JqZWN0RmxhZ3MuSW5zdGFudGlhdGVkLFxuICAgICAgdHMuT2JqZWN0RmxhZ3MuT2JqZWN0TGl0ZXJhbCxcbiAgICAgIHRzLk9iamVjdEZsYWdzLkV2b2x2aW5nQXJyYXksXG4gICAgICB0cy5PYmplY3RGbGFncy5PYmplY3RMaXRlcmFsUGF0dGVybldpdGhDb21wdXRlZFByb3BlcnRpZXMsXG4gICAgXTtcbiAgICBmb3IgKGNvbnN0IGZsYWcgb2Ygb2JqZWN0RmxhZ3MpIHtcbiAgICAgIGlmICgob2JqVHlwZS5vYmplY3RGbGFncyAmIGZsYWcpICE9PSAwKSB7XG4gICAgICAgIGRlYnVnU3RyaW5nICs9IGAgb2JqZWN0OiR7dHMuT2JqZWN0RmxhZ3NbZmxhZ119YDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodHlwZS5zeW1ib2wgJiYgdHlwZS5zeW1ib2wubmFtZSAhPT0gJ19fdHlwZScpIHtcbiAgICBkZWJ1Z1N0cmluZyArPSBgIHN5bWJvbC5uYW1lOiR7SlNPTi5zdHJpbmdpZnkodHlwZS5zeW1ib2wubmFtZSl9YDtcbiAgfVxuXG4gIGlmICh0eXBlLnBhdHRlcm4pIHtcbiAgICBkZWJ1Z1N0cmluZyArPSBgIGRlc3RydWN0dXJpbmc6dHJ1ZWA7XG4gIH1cblxuICByZXR1cm4gYHt0eXBlICR7ZGVidWdTdHJpbmd9fWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeW1ib2xUb0RlYnVnU3RyaW5nKHN5bTogdHMuU3ltYm9sKTogc3RyaW5nIHtcbiAgbGV0IGRlYnVnU3RyaW5nID0gYCR7SlNPTi5zdHJpbmdpZnkoc3ltLm5hbWUpfSBmbGFnczoweCR7c3ltLmZsYWdzLnRvU3RyaW5nKDE2KX1gO1xuXG4gIC8vIEp1c3QgdGhlIHVuaXF1ZSBmbGFncyAocG93ZXJzIG9mIHR3bykuIERlY2xhcmVkIGluIHNyYy9jb21waWxlci90eXBlcy50cy5cbiAgY29uc3Qgc3ltYm9sRmxhZ3MgPSBbXG4gICAgdHMuU3ltYm9sRmxhZ3MuRnVuY3Rpb25TY29wZWRWYXJpYWJsZSxcbiAgICB0cy5TeW1ib2xGbGFncy5CbG9ja1Njb3BlZFZhcmlhYmxlLFxuICAgIHRzLlN5bWJvbEZsYWdzLlByb3BlcnR5LFxuICAgIHRzLlN5bWJvbEZsYWdzLkVudW1NZW1iZXIsXG4gICAgdHMuU3ltYm9sRmxhZ3MuRnVuY3Rpb24sXG4gICAgdHMuU3ltYm9sRmxhZ3MuQ2xhc3MsXG4gICAgdHMuU3ltYm9sRmxhZ3MuSW50ZXJmYWNlLFxuICAgIHRzLlN5bWJvbEZsYWdzLkNvbnN0RW51bSxcbiAgICB0cy5TeW1ib2xGbGFncy5SZWd1bGFyRW51bSxcbiAgICB0cy5TeW1ib2xGbGFncy5WYWx1ZU1vZHVsZSxcbiAgICB0cy5TeW1ib2xGbGFncy5OYW1lc3BhY2VNb2R1bGUsXG4gICAgdHMuU3ltYm9sRmxhZ3MuVHlwZUxpdGVyYWwsXG4gICAgdHMuU3ltYm9sRmxhZ3MuT2JqZWN0TGl0ZXJhbCxcbiAgICB0cy5TeW1ib2xGbGFncy5NZXRob2QsXG4gICAgdHMuU3ltYm9sRmxhZ3MuQ29uc3RydWN0b3IsXG4gICAgdHMuU3ltYm9sRmxhZ3MuR2V0QWNjZXNzb3IsXG4gICAgdHMuU3ltYm9sRmxhZ3MuU2V0QWNjZXNzb3IsXG4gICAgdHMuU3ltYm9sRmxhZ3MuU2lnbmF0dXJlLFxuICAgIHRzLlN5bWJvbEZsYWdzLlR5cGVQYXJhbWV0ZXIsXG4gICAgdHMuU3ltYm9sRmxhZ3MuVHlwZUFsaWFzLFxuICAgIHRzLlN5bWJvbEZsYWdzLkV4cG9ydFZhbHVlLFxuICAgIHRzLlN5bWJvbEZsYWdzLkFsaWFzLFxuICAgIHRzLlN5bWJvbEZsYWdzLlByb3RvdHlwZSxcbiAgICB0cy5TeW1ib2xGbGFncy5FeHBvcnRTdGFyLFxuICAgIHRzLlN5bWJvbEZsYWdzLk9wdGlvbmFsLFxuICAgIHRzLlN5bWJvbEZsYWdzLlRyYW5zaWVudCxcbiAgXTtcbiAgZm9yIChjb25zdCBmbGFnIG9mIHN5bWJvbEZsYWdzKSB7XG4gICAgaWYgKChzeW0uZmxhZ3MgJiBmbGFnKSAhPT0gMCkge1xuICAgICAgZGVidWdTdHJpbmcgKz0gYCAke3RzLlN5bWJvbEZsYWdzW2ZsYWddfWA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlYnVnU3RyaW5nO1xufVxuXG4vKiogVHlwZVRyYW5zbGF0b3IgdHJhbnNsYXRlcyBUeXBlU2NyaXB0IHR5cGVzIHRvIENsb3N1cmUgdHlwZXMuICovXG5leHBvcnQgY2xhc3MgVHlwZVRyYW5zbGF0b3Ige1xuICAvKipcbiAgICogQSBsaXN0IG9mIHR5cGVzIHdlJ3ZlIGVuY291bnRlcmVkIHdoaWxlIGVtaXR0aW5nOyB1c2VkIHRvIGF2b2lkIGdldHRpbmcgc3R1Y2sgaW4gcmVjdXJzaXZlXG4gICAqIHR5cGVzLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBzZWVuVHlwZXM6IHRzLlR5cGVbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHdyaXRlIHR5cGVzIHN1aXRhYmxlIGZvciBhbiBcXEBleHRlcm5zIGZpbGUuIEV4dGVybnMgdHlwZXMgbXVzdCBub3QgcmVmZXIgdG9cbiAgICogbm9uLWV4dGVybnMgdHlwZXMgKGkuZS4gbm9uIGFtYmllbnQgdHlwZXMpIGFuZCBuZWVkIHRvIHVzZSBmdWxseSBxdWFsaWZpZWQgbmFtZXMuXG4gICAqL1xuICBpc0ZvckV4dGVybnMgPSBmYWxzZTtcblxuICAvKipcbiAgICogQHBhcmFtIG5vZGUgaXMgdGhlIHNvdXJjZSBBU1QgdHMuTm9kZSB0aGUgdHlwZSBjb21lcyBmcm9tLiAgVGhpcyBpcyB1c2VkXG4gICAqICAgICBpbiBzb21lIGNhc2VzIChlLmcuIGFub255bW91cyB0eXBlcykgZm9yIGxvb2tpbmcgdXAgZmllbGQgbmFtZXMuXG4gICAqIEBwYXJhbSBwYXRoQmxhY2tMaXN0IGlzIGEgc2V0IG9mIHBhdGhzIHRoYXQgc2hvdWxkIG5ldmVyIGdldCB0eXBlZDtcbiAgICogICAgIGFueSByZWZlcmVuY2UgdG8gc3ltYm9scyBkZWZpbmVkIGluIHRoZXNlIHBhdGhzIHNob3VsZCBieSB0eXBlZFxuICAgKiAgICAgYXMgez99LlxuICAgKiBAcGFyYW0gc3ltYm9sc1RvQWxpYXNlZE5hbWVzIGEgbWFwcGluZyBmcm9tIHN5bWJvbHMgKGBGb29gKSB0byBhIG5hbWUgaW4gc2NvcGUgdGhleSBzaG91bGQgYmVcbiAgICogICAgIGVtaXR0ZWQgYXMgKGUuZy4gYHRzaWNrbGVfZm9yd2FyZF9kZWNsYXJlXzEuRm9vYCkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBwcml2YXRlIHJlYWRvbmx5IG5vZGU6IHRzLk5vZGUsXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IHBhdGhCbGFja0xpc3Q/OiBTZXQ8c3RyaW5nPixcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgc3ltYm9sc1RvQWxpYXNlZE5hbWVzID0gbmV3IE1hcDx0cy5TeW1ib2wsIHN0cmluZz4oKSkge1xuICAgIC8vIE5vcm1hbGl6ZSBwYXRocyB0byBub3QgYnJlYWsgY2hlY2tzIG9uIFdpbmRvd3MuXG4gICAgaWYgKHRoaXMucGF0aEJsYWNrTGlzdCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnBhdGhCbGFja0xpc3QgPVxuICAgICAgICAgIG5ldyBTZXQ8c3RyaW5nPihBcnJheS5mcm9tKHRoaXMucGF0aEJsYWNrTGlzdC52YWx1ZXMoKSkubWFwKHAgPT4gcGF0aC5ub3JtYWxpemUocCkpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSB0cy5TeW1ib2wgdG8gYSBzdHJpbmcuXG4gICAqIE90aGVyIGFwcHJvYWNoZXMgdGhhdCBkb24ndCB3b3JrOlxuICAgKiAtIFR5cGVDaGVja2VyLnR5cGVUb1N0cmluZyB0cmFuc2xhdGVzIEFycmF5IGFzIFRbXS5cbiAgICogLSBUeXBlQ2hlY2tlci5zeW1ib2xUb1N0cmluZyBlbWl0cyB0eXBlcyB3aXRob3V0IHRoZWlyIG5hbWVzcGFjZSxcbiAgICogICBhbmQgZG9lc24ndCBsZXQgeW91IHBhc3MgdGhlIGZsYWcgdG8gY29udHJvbCB0aGF0LlxuICAgKiBAcGFyYW0gdXNlRnFuIHdoZXRoZXIgdG8gc2NvcGUgdGhlIG5hbWUgdXNpbmcgaXRzIGZ1bGx5IHF1YWxpZmllZCBuYW1lLiBDbG9zdXJlJ3MgdGVtcGxhdGVcbiAgICogICAgIGFyZ3VtZW50cyBhcmUgYWx3YXlzIHNjb3BlZCB0byB0aGUgY2xhc3MgY29udGFpbmluZyB0aGVtLCB3aGVyZSBUeXBlU2NyaXB0J3MgdGVtcGxhdGUgYXJnc1xuICAgKiAgICAgd291bGQgYmUgZnVsbHkgcXVhbGlmaWVkLiBJLmUuIHRoaXMgZmxhZyBpcyBmYWxzZSBmb3IgZ2VuZXJpYyB0eXBlcy5cbiAgICovXG4gIHB1YmxpYyBzeW1ib2xUb1N0cmluZyhzeW06IHRzLlN5bWJvbCwgdXNlRnFuOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAvLyBUaGlzIGZvbGxvd3MgZ2V0U2luZ2xlTGluZVN0cmluZ1dyaXRlciBpbiB0aGUgVHlwZVNjcmlwdCBjb21waWxlci5cbiAgICBsZXQgc3RyID0gJyc7XG4gICAgbGV0IHN5bUFsaWFzID0gc3ltO1xuICAgIGlmIChzeW1BbGlhcy5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSB7XG4gICAgICBzeW1BbGlhcyA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1BbGlhcyk7XG4gICAgfVxuICAgIGNvbnN0IGFsaWFzID0gdGhpcy5zeW1ib2xzVG9BbGlhc2VkTmFtZXMuZ2V0KHN5bUFsaWFzKTtcbiAgICBpZiAoYWxpYXMpIHJldHVybiBhbGlhcztcbiAgICBpZiAodXNlRnFuICYmIHRoaXMuaXNGb3JFeHRlcm5zKSB7XG4gICAgICAvLyBGb3IgcmVndWxhciB0eXBlIGVtaXQsIHdlIGNhbiB1c2UgVHlwZVNjcmlwdCdzIG5hbWluZyBydWxlcywgYXMgdGhleSBtYXRjaCBDbG9zdXJlJ3MgbmFtZVxuICAgICAgLy8gc2NvcGluZyBydWxlcy4gSG93ZXZlciB3aGVuIGVtaXR0aW5nIGV4dGVybnMgZmlsZXMgZm9yIGFtYmllbnRzLCBuYW1pbmcgcnVsZXMgY2hhbmdlLiBBc1xuICAgICAgLy8gQ2xvc3VyZSBkb2Vzbid0IHN1cHBvcnQgZXh0ZXJucyBtb2R1bGVzLCBhbGwgbmFtZXMgbXVzdCBiZSBnbG9iYWwgYW5kIHVzZSBnbG9iYWwgZnVsbHlcbiAgICAgIC8vIHF1YWxpZmllZCBuYW1lcy4gVGhlIGNvZGUgYmVsb3cgdXNlcyBUeXBlU2NyaXB0IHRvIGNvbnZlcnQgYSBzeW1ib2wgdG8gYSBmdWxsIHF1YWxpZmllZFxuICAgICAgLy8gbmFtZSBhbmQgdGhlbiBlbWl0cyB0aGF0LlxuICAgICAgbGV0IGZxbiA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0RnVsbHlRdWFsaWZpZWROYW1lKHN5bSk7XG4gICAgICBpZiAoZnFuLnN0YXJ0c1dpdGgoYFwiYCkgfHwgZnFuLnN0YXJ0c1dpdGgoYCdgKSkge1xuICAgICAgICAvLyBRdW90ZWQgRlFOcyBtZWFuIHRoZSBuYW1lIGlzIGZyb20gYSBtb2R1bGUsIGUuZy4gYCdwYXRoL3RvL21vZHVsZScuc29tZS5xdWFsaWZpZWQuTmFtZWAuXG4gICAgICAgIC8vIHRzaWNrbGUgZ2VuZXJhbGx5IHJlLXNjb3BlcyBuYW1lcyBpbiBtb2R1bGVzIHRoYXQgYXJlIG1vdmVkIHRvIGV4dGVybnMgaW50byB0aGUgZ2xvYmFsXG4gICAgICAgIC8vIG5hbWVzcGFjZS4gVGhhdCBkb2VzIG5vdCBxdWl0ZSBtYXRjaCBUUycgc2VtYW50aWNzIHdoZXJlIGFtYmllbnQgdHlwZXMgZnJvbSBtb2R1bGVzIGFyZVxuICAgICAgICAvLyBsb2NhbC4gSG93ZXZlciB2YWx1ZSBkZWNsYXJhdGlvbnMgdGhhdCBhcmUgbG9jYWwgdG8gbW9kdWxlcyBidXQgbm90IGRlZmluZWQgZG8gbm90IG1ha2VcbiAgICAgICAgLy8gc2Vuc2UgaWYgbm90IGdsb2JhbCwgZS5nLiBcImRlY2xhcmUgY2xhc3MgWCB7fTsgbmV3IFgoKTtcIiBjYW5ub3Qgd29yayB1bmxlc3MgYFhgIGlzXG4gICAgICAgIC8vIGFjdHVhbGx5IGEgZ2xvYmFsLlxuICAgICAgICAvLyBTbyB0aGlzIGNvZGUgc3RyaXBzIHRoZSBtb2R1bGUgcGF0aCBmcm9tIHRoZSB0eXBlIGFuZCB1c2VzIHRoZSBGUU4gYXMgYSBnbG9iYWwuXG4gICAgICAgIGZxbiA9IGZxbi5yZXBsYWNlKC9eW1wiJ11bXlwiJ10rWydcIl1cXC4vLCAnJyk7XG4gICAgICB9XG4gICAgICAvLyBEZWNsYXJhdGlvbnMgaW4gbW9kdWxlIGNhbiByZS1vcGVuIGdsb2JhbCB0eXBlcyB1c2luZyBcImRlY2xhcmUgZ2xvYmFsIHsgLi4uIH1cIi4gVGhlIGZxblxuICAgICAgLy8gdGhlbiBjb250YWlucyB0aGUgcHJlZml4IFwiZ2xvYmFsLlwiIGhlcmUuIEFzIHdlJ3JlIG1hcHBpbmcgdG8gZ2xvYmFsIHR5cGVzLCBqdXN0IHN0cmlwIHRoZVxuICAgICAgLy8gcHJlZml4LlxuICAgICAgY29uc3QgaXNJbkdsb2JhbCA9IChzeW0uZGVjbGFyYXRpb25zIHx8IFtdKS5zb21lKGQgPT4ge1xuICAgICAgICBsZXQgY3VycmVudDogdHMuTm9kZXx1bmRlZmluZWQgPSBkO1xuICAgICAgICB3aGlsZSAoY3VycmVudCkge1xuICAgICAgICAgIGlmIChjdXJyZW50LmZsYWdzICYgdHMuTm9kZUZsYWdzLkdsb2JhbEF1Z21lbnRhdGlvbikgcmV0dXJuIHRydWU7XG4gICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGlzSW5HbG9iYWwpIHtcbiAgICAgICAgZnFuID0gZnFuLnJlcGxhY2UoL15nbG9iYWxcXC4vLCAnJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5zdHJpcENsdXR6TmFtZXNwYWNlKGZxbik7XG4gICAgfVxuICAgIGNvbnN0IHdyaXRlVGV4dCA9ICh0ZXh0OiBzdHJpbmcpID0+IHN0ciArPSB0ZXh0O1xuICAgIGNvbnN0IGRvTm90aGluZyA9ICgpID0+IHtcbiAgICAgIHJldHVybjtcbiAgICB9O1xuXG4gICAgY29uc3QgYnVpbGRlciA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0U3ltYm9sRGlzcGxheUJ1aWxkZXIoKTtcbiAgICBjb25zdCB3cml0ZXI6IHRzLlN5bWJvbFdyaXRlciA9IHtcbiAgICAgIHdyaXRlS2V5d29yZDogd3JpdGVUZXh0LFxuICAgICAgd3JpdGVPcGVyYXRvcjogd3JpdGVUZXh0LFxuICAgICAgd3JpdGVQdW5jdHVhdGlvbjogd3JpdGVUZXh0LFxuICAgICAgd3JpdGVTcGFjZTogd3JpdGVUZXh0LFxuICAgICAgd3JpdGVTdHJpbmdMaXRlcmFsOiB3cml0ZVRleHQsXG4gICAgICB3cml0ZVBhcmFtZXRlcjogd3JpdGVUZXh0LFxuICAgICAgd3JpdGVQcm9wZXJ0eTogd3JpdGVUZXh0LFxuICAgICAgd3JpdGVTeW1ib2w6IHdyaXRlVGV4dCxcbiAgICAgIHdyaXRlTGluZTogZG9Ob3RoaW5nLFxuICAgICAgaW5jcmVhc2VJbmRlbnQ6IGRvTm90aGluZyxcbiAgICAgIGRlY3JlYXNlSW5kZW50OiBkb05vdGhpbmcsXG4gICAgICBjbGVhcjogZG9Ob3RoaW5nLFxuICAgICAgdHJhY2tTeW1ib2woc3ltYm9sOiB0cy5TeW1ib2wsIGVuY2xvc2luZ0RlY2xhcmF0aW9uPzogdHMuTm9kZSwgbWVhbmluZz86IHRzLlN5bWJvbEZsYWdzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0sXG4gICAgICByZXBvcnRJbmFjY2Vzc2libGVUaGlzRXJyb3I6IGRvTm90aGluZyxcbiAgICAgIHJlcG9ydFByaXZhdGVJbkJhc2VPZkNsYXNzRXhwcmVzc2lvbjogZG9Ob3RoaW5nLFxuICAgIH07XG4gICAgYnVpbGRlci5idWlsZFN5bWJvbERpc3BsYXkoc3ltLCB3cml0ZXIsIHRoaXMubm9kZSk7XG4gICAgcmV0dXJuIHRoaXMuc3RyaXBDbHV0ek5hbWVzcGFjZShzdHIpO1xuICB9XG5cbiAgLy8gQ2x1dHogKGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NsdXR6KSBlbWl0cyBnbG9iYWwgdHlwZSBzeW1ib2xzIGhpZGRlbiBpbiBhIHNwZWNpYWxcbiAgLy8g4LKgX+CyoC5jbHV0eiBuYW1lc3BhY2UuIFdoaWxlIG1vc3QgY29kZSBzZWVuIGJ5IFRzaWNrbGUgd2lsbCBvbmx5IGV2ZXIgc2VlIGxvY2FsIGFsaWFzZXMsIENsdXR6XG4gIC8vIHN5bWJvbHMgY2FuIGJlIHdyaXR0ZW4gYnkgdXNlcnMgZGlyZWN0bHkgaW4gY29kZSwgYW5kIHRoZXkgY2FuIGFwcGVhciBieSBkZXJlZmVyZW5jaW5nXG4gIC8vIFR5cGVBbGlhc2VzLiBUaGUgY29kZSBiZWxvdyBzaW1wbHkgc3RyaXBzIHRoZSBwcmVmaXgsIHRoZSByZW1haW5pbmcgdHlwZSBuYW1lIHRoZW4gbWF0Y2hlc1xuICAvLyBDbG9zdXJlJ3MgdHlwZS5cbiAgcHJpdmF0ZSBzdHJpcENsdXR6TmFtZXNwYWNlKG5hbWU6IHN0cmluZykge1xuICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ+CyoF/gsqAuY2x1dHouJykpIHJldHVybiBuYW1lLnN1YnN0cmluZygn4LKgX+CyoC5jbHV0ei4nLmxlbmd0aCk7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cblxuICB0cmFuc2xhdGUodHlwZTogdHMuVHlwZSk6IHN0cmluZyB7XG4gICAgLy8gTk9URTogVGhvdWdoIHR5cGUuZmxhZ3MgaGFzIHRoZSBuYW1lIFwiZmxhZ3NcIiwgaXQgdXN1YWxseSBjYW4gb25seSBiZSBvbmVcbiAgICAvLyBvZiB0aGUgZW51bSBvcHRpb25zIGF0IGEgdGltZSAoZXhjZXB0IGZvciB1bmlvbnMgb2YgbGl0ZXJhbCB0eXBlcywgZS5nLiB1bmlvbnMgb2YgYm9vbGVhblxuICAgIC8vIHZhbHVlcywgc3RyaW5nIHZhbHVlcywgZW51bSB2YWx1ZXMpLiBUaGlzIHN3aXRjaCBoYW5kbGVzIGFsbCB0aGUgY2FzZXMgaW4gdGhlIHRzLlR5cGVGbGFnc1xuICAgIC8vIGVudW0gaW4gdGhlIG9yZGVyIHRoZXkgb2NjdXIuXG5cbiAgICAvLyBOT1RFOiBTb21lIFR5cGVGbGFncyBhcmUgbWFya2VkIFwiaW50ZXJuYWxcIiBpbiB0aGUgZC50cyBidXQgc3RpbGwgc2hvdyB1cCBpbiB0aGUgdmFsdWUgb2ZcbiAgICAvLyB0eXBlLmZsYWdzLiBUaGlzIG1hc2sgbGltaXRzIHRoZSBmbGFnIGNoZWNrcyB0byB0aGUgb25lcyBpbiB0aGUgcHVibGljIEFQSS4gXCJsYXN0RmxhZ1wiIGhlcmVcbiAgICAvLyBpcyB0aGUgbGFzdCBmbGFnIGhhbmRsZWQgaW4gdGhpcyBzd2l0Y2ggc3RhdGVtZW50LCBhbmQgc2hvdWxkIGJlIGtlcHQgaW4gc3luYyB3aXRoXG4gICAgLy8gdHlwZXNjcmlwdC5kLnRzLlxuXG4gICAgLy8gTm9uUHJpbWl0aXZlIG9jY3VycyBvbiBpdHMgb3duIG9uIHRoZSBsb3dlciBjYXNlIFwib2JqZWN0XCIgdHlwZS4gU3BlY2lhbCBjYXNlIHRvIFwiIU9iamVjdFwiLlxuICAgIGlmICh0eXBlLmZsYWdzID09PSB0cy5UeXBlRmxhZ3MuTm9uUHJpbWl0aXZlKSByZXR1cm4gJyFPYmplY3QnO1xuXG4gICAgbGV0IGlzQW1iaWVudCA9IGZhbHNlO1xuICAgIGxldCBpc05hbWVzcGFjZSA9IGZhbHNlO1xuICAgIGxldCBpc01vZHVsZSA9IGZhbHNlO1xuICAgIGlmICh0eXBlLnN5bWJvbCkge1xuICAgICAgZm9yIChjb25zdCBkZWNsIG9mIHR5cGUuc3ltYm9sLmRlY2xhcmF0aW9ucyB8fCBbXSkge1xuICAgICAgICBpZiAodHMuaXNFeHRlcm5hbE1vZHVsZShkZWNsLmdldFNvdXJjZUZpbGUoKSkpIGlzTW9kdWxlID0gdHJ1ZTtcbiAgICAgICAgbGV0IGN1cnJlbnQ6IHRzLk5vZGV8dW5kZWZpbmVkID0gZGVjbDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgICAgICBpZiAodHMuZ2V0Q29tYmluZWRNb2RpZmllckZsYWdzKGN1cnJlbnQpICYgdHMuTW9kaWZpZXJGbGFncy5BbWJpZW50KSBpc0FtYmllbnQgPSB0cnVlO1xuICAgICAgICAgIGlmIChjdXJyZW50LmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTW9kdWxlRGVjbGFyYXRpb24pIGlzTmFtZXNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0c2lja2xlIGNhbm5vdCBnZW5lcmF0ZSB0eXBlcyBmb3Igbm9uLWFtYmllbnQgbmFtZXNwYWNlcy5cbiAgICBpZiAoaXNOYW1lc3BhY2UgJiYgIWlzQW1iaWVudCkgcmV0dXJuICc/JztcblxuICAgIC8vIFR5cGVzIGluIGV4dGVybnMgY2Fubm90IHJlZmVyZW5jZSB0eXBlcyBmcm9tIGV4dGVybmFsIG1vZHVsZXMuXG4gICAgLy8gSG93ZXZlciBhbWJpZW50IHR5cGVzIGluIG1vZHVsZXMgZ2V0IG1vdmVkIHRvIGV4dGVybnMsIHRvbywgc28gdHlwZSByZWZlcmVuY2VzIHdvcmsgYW5kIHdlXG4gICAgLy8gY2FuIGVtaXQgYSBwcmVjaXNlIHR5cGUuXG4gICAgaWYgKHRoaXMuaXNGb3JFeHRlcm5zICYmIGlzTW9kdWxlICYmICFpc0FtYmllbnQpIHJldHVybiAnPyc7XG5cbiAgICBjb25zdCBsYXN0RmxhZyA9IHRzLlR5cGVGbGFncy5JbmRleGVkQWNjZXNzO1xuICAgIGNvbnN0IG1hc2sgPSAobGFzdEZsYWcgPDwgMSkgLSAxO1xuICAgIHN3aXRjaCAodHlwZS5mbGFncyAmIG1hc2spIHtcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLkFueTpcbiAgICAgICAgcmV0dXJuICc/JztcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLlN0cmluZzpcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLlN0cmluZ0xpdGVyYWw6XG4gICAgICAgIHJldHVybiAnc3RyaW5nJztcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLk51bWJlcjpcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLk51bWJlckxpdGVyYWw6XG4gICAgICAgIHJldHVybiAnbnVtYmVyJztcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLkJvb2xlYW46XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5Cb29sZWFuTGl0ZXJhbDpcbiAgICAgICAgLy8gU2VlIHRoZSBub3RlIGluIHRyYW5zbGF0ZVVuaW9uIGFib3V0IGJvb2xlYW5zLlxuICAgICAgICByZXR1cm4gJ2Jvb2xlYW4nO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuRW51bTpcbiAgICAgICAgaWYgKCF0eXBlLnN5bWJvbCkge1xuICAgICAgICAgIHRoaXMud2FybihgRW51bVR5cGUgd2l0aG91dCBhIHN5bWJvbGApO1xuICAgICAgICAgIHJldHVybiAnPyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sVG9TdHJpbmcodHlwZS5zeW1ib2wsIHRydWUpO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuRVNTeW1ib2w6XG4gICAgICAgIC8vIE5PVEU6IGN1cnJlbnRseSB0aGlzIGlzIGp1c3QgYSB0eXBlZGVmIGZvciB7P30sIHNocnVnLlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtY29tcGlsZXIvYmxvYi81NWNmNDNlZTMxZTgwZDg5ZDcwODdhZjY1YjU1NDJhYTYzOTg3ODc0L2V4dGVybnMvZXMzLmpzI0wzNFxuICAgICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5Wb2lkOlxuICAgICAgICByZXR1cm4gJ3ZvaWQnO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuVW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5OdWxsOlxuICAgICAgICByZXR1cm4gJ251bGwnO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuTmV2ZXI6XG4gICAgICAgIHRoaXMud2Fybihgc2hvdWxkIG5vdCBlbWl0IGEgJ25ldmVyJyB0eXBlYCk7XG4gICAgICAgIHJldHVybiAnPyc7XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5UeXBlUGFyYW1ldGVyOlxuICAgICAgICAvLyBUaGlzIGlzIGUuZy4gdGhlIFQgaW4gYSB0eXBlIGxpa2UgRm9vPFQ+LlxuICAgICAgICBpZiAoIXR5cGUuc3ltYm9sKSB7XG4gICAgICAgICAgdGhpcy53YXJuKGBUeXBlUGFyYW1ldGVyIHdpdGhvdXQgYSBzeW1ib2xgKTsgIC8vIHNob3VsZCBub3QgaGFwcGVuICh0bSlcbiAgICAgICAgICByZXR1cm4gJz8nO1xuICAgICAgICB9XG4gICAgICAgIC8vIEluIENsb3N1cmUgQ29tcGlsZXIsIHR5cGUgcGFyYW1ldGVycyAqYXJlKiBzY29wZWQgdG8gdGhlaXIgY29udGFpbmluZyBjbGFzcy5cbiAgICAgICAgY29uc3QgdXNlRnFuID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bWJvbFRvU3RyaW5nKHR5cGUuc3ltYm9sLCB1c2VGcW4pO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuT2JqZWN0OlxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVPYmplY3QodHlwZSBhcyB0cy5PYmplY3RUeXBlKTtcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLlVuaW9uOlxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVVbmlvbih0eXBlIGFzIHRzLlVuaW9uVHlwZSk7XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5JbnRlcnNlY3Rpb246XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5JbmRleDpcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLkluZGV4ZWRBY2Nlc3M6XG4gICAgICAgIC8vIFRPRE8odHMyLjEpOiBoYW5kbGUgdGhlc2Ugc3BlY2lhbCB0eXBlcy5cbiAgICAgICAgdGhpcy53YXJuKGB1bmhhbmRsZWQgdHlwZSBmbGFnczogJHt0cy5UeXBlRmxhZ3NbdHlwZS5mbGFnc119YCk7XG4gICAgICAgIHJldHVybiAnPyc7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBIYW5kbGUgY2FzZXMgd2hlcmUgbXVsdGlwbGUgZmxhZ3MgYXJlIHNldC5cblxuICAgICAgICAvLyBUeXBlcyB3aXRoIGxpdGVyYWwgbWVtYmVycyBhcmUgcmVwcmVzZW50ZWQgYXNcbiAgICAgICAgLy8gICB0cy5UeXBlRmxhZ3MuVW5pb24gfCBbbGl0ZXJhbCBtZW1iZXJdXG4gICAgICAgIC8vIEUuZy4gYW4gZW51bSB0eXBlZCB2YWx1ZSBpcyBhIHVuaW9uIHR5cGUgd2l0aCB0aGUgZW51bSdzIG1lbWJlcnMgYXMgaXRzIG1lbWJlcnMuIEFcbiAgICAgICAgLy8gYm9vbGVhbiB0eXBlIGlzIGEgdW5pb24gdHlwZSB3aXRoICd0cnVlJyBhbmQgJ2ZhbHNlJyBhcyBpdHMgbWVtYmVycy5cbiAgICAgICAgLy8gTm90ZSBhbHNvIHRoYXQgaW4gYSBtb3JlIGNvbXBsZXggdW5pb24sIGUuZy4gYm9vbGVhbnxudW1iZXIsIHRoZW4gaXQncyBhIHVuaW9uIG9mIHRocmVlXG4gICAgICAgIC8vIHRoaW5ncyAodHJ1ZXxmYWxzZXxudW1iZXIpIGFuZCB0cy5UeXBlRmxhZ3MuQm9vbGVhbiBkb2Vzbid0IHNob3cgdXAgYXQgYWxsLlxuICAgICAgICBpZiAodHlwZS5mbGFncyAmIHRzLlR5cGVGbGFncy5Vbmlvbikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVVuaW9uKHR5cGUgYXMgdHMuVW5pb25UeXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlLmZsYWdzICYgdHMuVHlwZUZsYWdzLkVudW1MaXRlcmFsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlRW51bUxpdGVyYWwodHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgc3dpdGNoIHN0YXRlbWVudCBzaG91bGQgaGF2ZSBiZWVuIGV4aGF1c3RpdmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdW5rbm93biB0eXBlIGZsYWdzICR7dHlwZS5mbGFnc30gb24gJHt0eXBlVG9EZWJ1Z1N0cmluZyh0eXBlKX1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYW5zbGF0ZVVuaW9uKHR5cGU6IHRzLlVuaW9uVHlwZSk6IHN0cmluZyB7XG4gICAgbGV0IHBhcnRzID0gdHlwZS50eXBlcy5tYXAodCA9PiB0aGlzLnRyYW5zbGF0ZSh0KSk7XG4gICAgLy8gVW5pb24gdHlwZXMgdGhhdCBpbmNsdWRlIGxpdGVyYWxzIChlLmcuIGJvb2xlYW4sIGVudW0pIGNhbiBlbmQgdXAgcmVwZWF0aW5nIHRoZSBzYW1lIENsb3N1cmVcbiAgICAvLyB0eXBlLiBGb3IgZXhhbXBsZTogdHJ1ZSB8IGJvb2xlYW4gd2lsbCBiZSB0cmFuc2xhdGVkIHRvIGJvb2xlYW4gfCBib29sZWFuLlxuICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIHRvIHByb2R1Y2UgdHlwZXMgdGhhdCByZWFkIGJldHRlci5cbiAgICBwYXJ0cyA9IHBhcnRzLmZpbHRlcigoZWwsIGlkeCkgPT4gcGFydHMuaW5kZXhPZihlbCkgPT09IGlkeCk7XG4gICAgcmV0dXJuIHBhcnRzLmxlbmd0aCA9PT0gMSA/IHBhcnRzWzBdIDogYCgke3BhcnRzLmpvaW4oJ3wnKX0pYDtcbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNsYXRlRW51bUxpdGVyYWwodHlwZTogdHMuVHlwZSk6IHN0cmluZyB7XG4gICAgLy8gU3VwcG9zZSB5b3UgaGFkOlxuICAgIC8vICAgZW51bSBFbnVtVHlwZSB7IE1FTUJFUiB9XG4gICAgLy8gdGhlbiB0aGUgdHlwZSBvZiBcIkVudW1UeXBlLk1FTUJFUlwiIGlzIGFuIGVudW0gbGl0ZXJhbCAodGhlIHRoaW5nIHBhc3NlZCB0byB0aGlzIGZ1bmN0aW9uKVxuICAgIC8vIGFuZCBpdCBoYXMgdHlwZSBmbGFncyB0aGF0IGluY2x1ZGVcbiAgICAvLyAgIHRzLlR5cGVGbGFncy5OdW1iZXJMaXRlcmFsIHwgdHMuVHlwZUZsYWdzLkVudW1MaXRlcmFsXG4gICAgLy9cbiAgICAvLyBDbG9zdXJlIENvbXBpbGVyIGRvZXNuJ3Qgc3VwcG9ydCBsaXRlcmFscyBpbiB0eXBlcywgc28gdGhpcyBjb2RlIG11c3Qgbm90IGVtaXRcbiAgICAvLyBcIkVudW1UeXBlLk1FTUJFUlwiLCBidXQgcmF0aGVyIFwiRW51bVR5cGVcIi5cblxuICAgIGNvbnN0IGVudW1MaXRlcmFsQmFzZVR5cGUgPSB0aGlzLnR5cGVDaGVja2VyLmdldEJhc2VUeXBlT2ZMaXRlcmFsVHlwZSh0eXBlKTtcbiAgICBpZiAoIWVudW1MaXRlcmFsQmFzZVR5cGUuc3ltYm9sKSB7XG4gICAgICB0aGlzLndhcm4oYEVudW1MaXRlcmFsVHlwZSB3aXRob3V0IGEgc3ltYm9sYCk7XG4gICAgICByZXR1cm4gJz8nO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zeW1ib2xUb1N0cmluZyhlbnVtTGl0ZXJhbEJhc2VUeXBlLnN5bWJvbCwgdHJ1ZSk7XG4gIH1cblxuICAvLyB0cmFuc2xhdGVPYmplY3QgdHJhbnNsYXRlcyBhIHRzLk9iamVjdFR5cGUsIHdoaWNoIGlzIHRoZSB0eXBlIG9mIGFsbFxuICAvLyBvYmplY3QtbGlrZSB0aGluZ3MgaW4gVFMsIHN1Y2ggYXMgY2xhc3NlcyBhbmQgaW50ZXJmYWNlcy5cbiAgcHJpdmF0ZSB0cmFuc2xhdGVPYmplY3QodHlwZTogdHMuT2JqZWN0VHlwZSk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGUuc3ltYm9sICYmIHRoaXMuaXNCbGFja0xpc3RlZCh0eXBlLnN5bWJvbCkpIHJldHVybiAnPyc7XG5cbiAgICAvLyBOT1RFOiBvYmplY3RGbGFncyBpcyBhbiBlbnVtLCBidXQgYSBnaXZlbiB0eXBlIGNhbiBoYXZlIG11bHRpcGxlIGZsYWdzLlxuICAgIC8vIEFycmF5PHN0cmluZz4gaXMgYm90aCB0cy5PYmplY3RGbGFncy5SZWZlcmVuY2UgYW5kIHRzLk9iamVjdEZsYWdzLkludGVyZmFjZS5cblxuICAgIGlmICh0eXBlLm9iamVjdEZsYWdzICYgdHMuT2JqZWN0RmxhZ3MuQ2xhc3MpIHtcbiAgICAgIGlmICghdHlwZS5zeW1ib2wpIHtcbiAgICAgICAgdGhpcy53YXJuKCdjbGFzcyBoYXMgbm8gc3ltYm9sJyk7XG4gICAgICAgIHJldHVybiAnPyc7XG4gICAgICB9XG4gICAgICByZXR1cm4gJyEnICsgdGhpcy5zeW1ib2xUb1N0cmluZyh0eXBlLnN5bWJvbCwgLyogdXNlRnFuICovIHRydWUpO1xuICAgIH0gZWxzZSBpZiAodHlwZS5vYmplY3RGbGFncyAmIHRzLk9iamVjdEZsYWdzLkludGVyZmFjZSkge1xuICAgICAgLy8gTm90ZTogdHMuSW50ZXJmYWNlVHlwZSBoYXMgYSB0eXBlUGFyYW1ldGVycyBmaWVsZCwgYnV0IHRoYXRcbiAgICAgIC8vIHNwZWNpZmllcyB0aGUgcGFyYW1ldGVycyB0aGF0IHRoZSBpbnRlcmZhY2UgdHlwZSAqZXhwZWN0cypcbiAgICAgIC8vIHdoZW4gaXQncyB1c2VkLCBhbmQgc2hvdWxkIG5vdCBiZSB0cmFuc2Zvcm1lZCB0byB0aGUgb3V0cHV0LlxuICAgICAgLy8gRS5nLiBhIHR5cGUgbGlrZSBBcnJheTxudW1iZXI+IGlzIGEgVHlwZVJlZmVyZW5jZSB0byB0aGVcbiAgICAgIC8vIEludGVyZmFjZVR5cGUgXCJBcnJheVwiLCBidXQgdGhlIFwibnVtYmVyXCIgdHlwZSBwYXJhbWV0ZXIgaXNcbiAgICAgIC8vIHBhcnQgb2YgdGhlIG91dGVyIFR5cGVSZWZlcmVuY2UsIG5vdCBhIHR5cGVQYXJhbWV0ZXIgb25cbiAgICAgIC8vIHRoZSBJbnRlcmZhY2VUeXBlLlxuICAgICAgaWYgKCF0eXBlLnN5bWJvbCkge1xuICAgICAgICB0aGlzLndhcm4oJ2ludGVyZmFjZSBoYXMgbm8gc3ltYm9sJyk7XG4gICAgICAgIHJldHVybiAnPyc7XG4gICAgICB9XG4gICAgICBpZiAodHlwZS5zeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5WYWx1ZSkge1xuICAgICAgICAvLyBUaGUgc3ltYm9sIGlzIGJvdGggYSB0eXBlIGFuZCBhIHZhbHVlLlxuICAgICAgICAvLyBGb3IgdXNlci1kZWZpbmVkIHR5cGVzIGluIHRoaXMgc3RhdGUsIHdlIGRvbid0IGhhdmUgYSBDbG9zdXJlIG5hbWVcbiAgICAgICAgLy8gZm9yIHRoZSB0eXBlLiAgU2VlIHRoZSB0eXBlX2FuZF92YWx1ZSB0ZXN0LlxuICAgICAgICBpZiAoIWlzQ2xvc3VyZVByb3ZpZGVkVHlwZSh0eXBlLnN5bWJvbCkpIHtcbiAgICAgICAgICB0aGlzLndhcm4oYHR5cGUvc3ltYm9sIGNvbmZsaWN0IGZvciAke3R5cGUuc3ltYm9sLm5hbWV9LCB1c2luZyB7P30gZm9yIG5vd2ApO1xuICAgICAgICAgIHJldHVybiAnPyc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAnIScgKyB0aGlzLnN5bWJvbFRvU3RyaW5nKHR5cGUuc3ltYm9sLCAvKiB1c2VGcW4gKi8gdHJ1ZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlLm9iamVjdEZsYWdzICYgdHMuT2JqZWN0RmxhZ3MuUmVmZXJlbmNlKSB7XG4gICAgICAvLyBBIHJlZmVyZW5jZSB0byBhbm90aGVyIHR5cGUsIGUuZy4gQXJyYXk8bnVtYmVyPiByZWZlcnMgdG8gQXJyYXkuXG4gICAgICAvLyBFbWl0IHRoZSByZWZlcmVuY2VkIHR5cGUgYW5kIGFueSB0eXBlIGFyZ3VtZW50cy5cbiAgICAgIGNvbnN0IHJlZmVyZW5jZVR5cGUgPSB0eXBlIGFzIHRzLlR5cGVSZWZlcmVuY2U7XG5cbiAgICAgIC8vIEEgdHVwbGUgaXMgYSBSZWZlcmVuY2VUeXBlIHdoZXJlIHRoZSB0YXJnZXQgaXMgZmxhZ2dlZCBUdXBsZSBhbmQgdGhlXG4gICAgICAvLyB0eXBlQXJndW1lbnRzIGFyZSB0aGUgdHVwbGUgYXJndW1lbnRzLiAgSnVzdCB0cmVhdCBpdCBhcyBhIG15c3RlcnlcbiAgICAgIC8vIGFycmF5LCBiZWNhdXNlIENsb3N1cmUgZG9lc24ndCB1bmRlcnN0YW5kIHR1cGxlcy5cbiAgICAgIGlmIChyZWZlcmVuY2VUeXBlLnRhcmdldC5vYmplY3RGbGFncyAmIHRzLk9iamVjdEZsYWdzLlR1cGxlKSB7XG4gICAgICAgIHJldHVybiAnIUFycmF5PD8+JztcbiAgICAgIH1cblxuICAgICAgbGV0IHR5cGVTdHIgPSAnJztcbiAgICAgIGlmIChyZWZlcmVuY2VUeXBlLnRhcmdldCA9PT0gcmVmZXJlbmNlVHlwZSkge1xuICAgICAgICAvLyBXZSBnZXQgaW50byBhbiBpbmZpbml0ZSBsb29wIGhlcmUgaWYgdGhlIGlubmVyIHJlZmVyZW5jZSBpc1xuICAgICAgICAvLyB0aGUgc2FtZSBhcyB0aGUgb3V0ZXI7IHRoaXMgY2FuIG9jY3VyIHdoZW4gdGhpcyBmdW5jdGlvblxuICAgICAgICAvLyBmYWlscyB0byB0cmFuc2xhdGUgYSBtb3JlIHNwZWNpZmljIHR5cGUgYmVmb3JlIGdldHRpbmcgdG9cbiAgICAgICAgLy8gdGhpcyBwb2ludC5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYHJlZmVyZW5jZSBsb29wIGluICR7dHlwZVRvRGVidWdTdHJpbmcocmVmZXJlbmNlVHlwZSl9ICR7cmVmZXJlbmNlVHlwZS5mbGFnc31gKTtcbiAgICAgIH1cbiAgICAgIHR5cGVTdHIgKz0gdGhpcy50cmFuc2xhdGUocmVmZXJlbmNlVHlwZS50YXJnZXQpO1xuICAgICAgLy8gVHJhbnNsYXRlIGNhbiByZXR1cm4gJz8nIGZvciBhIG51bWJlciBvZiBzaXR1YXRpb25zLCBlLmcuIHR5cGUvdmFsdWUgY29uZmxpY3RzLlxuICAgICAgLy8gYD88Pz5gIGlzIGlsbGVnYWwgc3ludGF4IGluIENsb3N1cmUgQ29tcGlsZXIsIHNvIGp1c3QgcmV0dXJuIGA/YCBoZXJlLlxuICAgICAgaWYgKHR5cGVTdHIgPT09ICc/JykgcmV0dXJuICc/JztcbiAgICAgIGlmIChyZWZlcmVuY2VUeXBlLnR5cGVBcmd1bWVudHMpIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gcmVmZXJlbmNlVHlwZS50eXBlQXJndW1lbnRzLm1hcCh0ID0+IHRoaXMudHJhbnNsYXRlKHQpKTtcbiAgICAgICAgdHlwZVN0ciArPSBgPCR7cGFyYW1zLmpvaW4oJywgJyl9PmA7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHlwZVN0cjtcbiAgICB9IGVsc2UgaWYgKHR5cGUub2JqZWN0RmxhZ3MgJiB0cy5PYmplY3RGbGFncy5Bbm9ueW1vdXMpIHtcbiAgICAgIGlmICghdHlwZS5zeW1ib2wpIHtcbiAgICAgICAgLy8gVGhpcyBjb21lcyB1cCB3aGVuIGdlbmVyYXRpbmcgY29kZSBmb3IgYW4gYXJyb3cgZnVuY3Rpb24gYXMgcGFzc2VkXG4gICAgICAgIC8vIHRvIGEgZ2VuZXJpYyBmdW5jdGlvbi4gIFRoZSBwYXNzZWQtaW4gdHlwZSBpcyB0YWdnZWQgYXMgYW5vbnltb3VzXG4gICAgICAgIC8vIGFuZCBoYXMgbm8gcHJvcGVydGllcyBzbyBpdCdzIGhhcmQgdG8gZmlndXJlIG91dCB3aGF0IHRvIGdlbmVyYXRlLlxuICAgICAgICAvLyBKdXN0IGF2b2lkIGl0IGZvciBub3cgc28gd2UgZG9uJ3QgY3Jhc2guXG4gICAgICAgIHRoaXMud2FybignYW5vbnltb3VzIHR5cGUgaGFzIG5vIHN5bWJvbCcpO1xuICAgICAgICByZXR1cm4gJz8nO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZS5zeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5UeXBlTGl0ZXJhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVUeXBlTGl0ZXJhbCh0eXBlKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgdHlwZS5zeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5GdW5jdGlvbiB8fFxuICAgICAgICAgIHR5cGUuc3ltYm9sLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuTWV0aG9kKSB7XG4gICAgICAgIGNvbnN0IHNpZ3MgPSB0aGlzLnR5cGVDaGVja2VyLmdldFNpZ25hdHVyZXNPZlR5cGUodHlwZSwgdHMuU2lnbmF0dXJlS2luZC5DYWxsKTtcbiAgICAgICAgaWYgKHNpZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2lnbmF0dXJlVG9DbG9zdXJlKHNpZ3NbMF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLndhcm4oJ3VuaGFuZGxlZCBhbm9ueW1vdXMgdHlwZScpO1xuICAgICAgcmV0dXJuICc/JztcbiAgICB9XG5cbiAgICAvKlxuICAgIFRPRE8odHMyLjEpOiBtb3JlIHVuaGFuZGxlZCBvYmplY3QgdHlwZSBmbGFnczpcbiAgICAgIFR1cGxlXG4gICAgICBNYXBwZWRcbiAgICAgIEluc3RhbnRpYXRlZFxuICAgICAgT2JqZWN0TGl0ZXJhbFxuICAgICAgRXZvbHZpbmdBcnJheVxuICAgICAgT2JqZWN0TGl0ZXJhbFBhdHRlcm5XaXRoQ29tcHV0ZWRQcm9wZXJ0aWVzXG4gICAgKi9cbiAgICB0aGlzLndhcm4oYHVuaGFuZGxlZCB0eXBlICR7dHlwZVRvRGVidWdTdHJpbmcodHlwZSl9YCk7XG4gICAgcmV0dXJuICc/JztcbiAgfVxuXG4gIC8qKlxuICAgKiB0cmFuc2xhdGVUeXBlTGl0ZXJhbCB0cmFuc2xhdGVzIGEgdHMuU3ltYm9sRmxhZ3MuVHlwZUxpdGVyYWwgdHlwZSwgd2hpY2hcbiAgICogaXMgdGhlIGFub255bW91cyB0eXBlIGVuY291bnRlcmVkIGluIGUuZy5cbiAgICogICBsZXQgeDoge2E6IG51bWJlcn07XG4gICAqL1xuICBwcml2YXRlIHRyYW5zbGF0ZVR5cGVMaXRlcmFsKHR5cGU6IHRzLlR5cGUpOiBzdHJpbmcge1xuICAgIC8vIEF2b2lkIGluZmluaXRlIGxvb3BzIG9uIHJlY3Vyc2l2ZSB0eXBlcy5cbiAgICAvLyBJdCB3b3VsZCBiZSBuaWNlIHRvIGp1c3QgZW1pdCB0aGUgbmFtZSBvZiB0aGUgcmVjdXJzaXZlIHR5cGUgaGVyZSxcbiAgICAvLyBidXQgdHlwZS5zeW1ib2wgZG9lc24ndCBzZWVtIHRvIGhhdmUgdGhlIG5hbWUgaGVyZSAocGVyaGFwcyBzb21ldGhpbmdcbiAgICAvLyB0byBkbyB3aXRoIGFsaWFzZXM/KS5cbiAgICBpZiAodGhpcy5zZWVuVHlwZXMuaW5kZXhPZih0eXBlKSAhPT0gLTEpIHJldHVybiAnPyc7XG4gICAgdGhpcy5zZWVuVHlwZXMucHVzaCh0eXBlKTtcblxuICAgIC8vIEdhdGhlciB1cCBhbGwgdGhlIG5hbWVkIGZpZWxkcyBhbmQgd2hldGhlciB0aGUgb2JqZWN0IGlzIGFsc28gY2FsbGFibGUuXG4gICAgbGV0IGNhbGxhYmxlID0gZmFsc2U7XG4gICAgbGV0IGluZGV4YWJsZSA9IGZhbHNlO1xuICAgIGNvbnN0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBpZiAoIXR5cGUuc3ltYm9sIHx8ICF0eXBlLnN5bWJvbC5tZW1iZXJzKSB7XG4gICAgICB0aGlzLndhcm4oJ3R5cGUgbGl0ZXJhbCBoYXMgbm8gc3ltYm9sJyk7XG4gICAgICByZXR1cm4gJz8nO1xuICAgIH1cblxuICAgIC8vIHNwZWNpYWwtY2FzZSBjb25zdHJ1Y3Qgc2lnbmF0dXJlcy5cbiAgICBjb25zdCBjdG9ycyA9IHR5cGUuZ2V0Q29uc3RydWN0U2lnbmF0dXJlcygpO1xuICAgIGlmIChjdG9ycy5sZW5ndGgpIHtcbiAgICAgIC8vIFRPRE8obWFydGlucHJvYnN0KTogdGhpcyBkb2VzIG5vdCBzdXBwb3J0IGFkZGl0aW9uYWwgcHJvcGVydGllcyBkZWZpbmVkIG9uIGNvbnN0cnVjdG9yc1xuICAgICAgLy8gKG5vdCBleHByZXNzaWJsZSBpbiBDbG9zdXJlKSwgbm9yIG11bHRpcGxlIGNvbnN0cnVjdG9ycyAoc2FtZSkuXG4gICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLmNvbnZlcnRQYXJhbXMoY3RvcnNbMF0pO1xuICAgICAgY29uc3QgcGFyYW1zU3RyID0gcGFyYW1zLmxlbmd0aCA/ICgnLCAnICsgcGFyYW1zLmpvaW4oJywgJykpIDogJyc7XG4gICAgICBjb25zdCBjb25zdHJ1Y3RlZFR5cGUgPSB0aGlzLnRyYW5zbGF0ZShjdG9yc1swXS5nZXRSZXR1cm5UeXBlKCkpO1xuICAgICAgLy8gSW4gdGhlIHNwZWNpZmljIGNhc2Ugb2YgdGhlIFwibmV3XCIgaW4gYSBmdW5jdGlvbiwgaXQgYXBwZWFycyB0aGF0XG4gICAgICAvLyAgIGZ1bmN0aW9uKG5ldzogIUJhcilcbiAgICAgIC8vIGZhaWxzIHRvIHBhcnNlLCB3aGlsZVxuICAgICAgLy8gICBmdW5jdGlvbihuZXc6ICghQmFyKSlcbiAgICAgIC8vIHBhcnNlcyBpbiB0aGUgd2F5IHlvdSdkIGV4cGVjdC5cbiAgICAgIC8vIEl0IGFwcGVhcnMgZnJvbSB0ZXN0aW5nIHRoYXQgQ2xvc3VyZSBpZ25vcmVzIHRoZSAhIGFueXdheSBhbmQganVzdFxuICAgICAgLy8gYXNzdW1lcyB0aGUgcmVzdWx0IHdpbGwgYmUgbm9uLW51bGwgaW4gZWl0aGVyIGNhc2UuICAoVG8gYmUgcGVkYW50aWMsXG4gICAgICAvLyBpdCdzIHBvc3NpYmxlIHRvIHJldHVybiBudWxsIGZyb20gYSBjdG9yIGl0IHNlZW1zIGxpa2UgYSBiYWQgaWRlYS4pXG4gICAgICByZXR1cm4gYGZ1bmN0aW9uKG5ldzogKCR7Y29uc3RydWN0ZWRUeXBlfSkke3BhcmFtc1N0cn0pOiA/YDtcbiAgICB9XG5cbiAgICAvLyBtZW1iZXJzIGlzIGFuIEVTNiBtYXAsIGJ1dCB0aGUgLmQudHMgZGVmaW5pbmcgaXQgZGVmaW5lZCB0aGVpciBvd24gbWFwXG4gICAgLy8gdHlwZSwgc28gdHlwZXNjcmlwdCBkb2Vzbid0IGJlbGlldmUgdGhhdCAua2V5cygpIGlzIGl0ZXJhYmxlXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIGZvciAoY29uc3QgZmllbGQgb2YgKHR5cGUuc3ltYm9sLm1lbWJlcnMua2V5cygpIGFzIGFueSkpIHtcbiAgICAgIHN3aXRjaCAoZmllbGQpIHtcbiAgICAgICAgY2FzZSAnX19jYWxsJzpcbiAgICAgICAgICBjYWxsYWJsZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ19faW5kZXgnOlxuICAgICAgICAgIGluZGV4YWJsZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc3QgbWVtYmVyID0gdHlwZS5zeW1ib2wubWVtYmVycy5nZXQoZmllbGQpITtcbiAgICAgICAgICAvLyBvcHRpb25hbCBtZW1iZXJzIGFyZSBoYW5kbGVkIGJ5IHRoZSB0eXBlIGluY2x1ZGluZyB8dW5kZWZpbmVkIGluIGEgdW5pb24gdHlwZS5cbiAgICAgICAgICBjb25zdCBtZW1iZXJUeXBlID1cbiAgICAgICAgICAgICAgdGhpcy50cmFuc2xhdGUodGhpcy50eXBlQ2hlY2tlci5nZXRUeXBlT2ZTeW1ib2xBdExvY2F0aW9uKG1lbWJlciwgdGhpcy5ub2RlKSk7XG4gICAgICAgICAgZmllbGRzLnB1c2goYCR7ZmllbGR9OiAke21lbWJlclR5cGV9YCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIHNwZWNpYWwtY2FzZSBwbGFpbiBrZXktdmFsdWUgb2JqZWN0cyBhbmQgZnVuY3Rpb25zLlxuICAgIGlmIChmaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAoY2FsbGFibGUgJiYgIWluZGV4YWJsZSkge1xuICAgICAgICAvLyBBIGZ1bmN0aW9uIHR5cGUuXG4gICAgICAgIGNvbnN0IHNpZ3MgPSB0aGlzLnR5cGVDaGVja2VyLmdldFNpZ25hdHVyZXNPZlR5cGUodHlwZSwgdHMuU2lnbmF0dXJlS2luZC5DYWxsKTtcbiAgICAgICAgaWYgKHNpZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2lnbmF0dXJlVG9DbG9zdXJlKHNpZ3NbMF0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGluZGV4YWJsZSAmJiAhY2FsbGFibGUpIHtcbiAgICAgICAgLy8gQSBwbGFpbiBrZXktdmFsdWUgbWFwIHR5cGUuXG4gICAgICAgIGxldCBrZXlUeXBlID0gJ3N0cmluZyc7XG4gICAgICAgIGxldCB2YWxUeXBlID0gdGhpcy50eXBlQ2hlY2tlci5nZXRJbmRleFR5cGVPZlR5cGUodHlwZSwgdHMuSW5kZXhLaW5kLlN0cmluZyk7XG4gICAgICAgIGlmICghdmFsVHlwZSkge1xuICAgICAgICAgIGtleVR5cGUgPSAnbnVtYmVyJztcbiAgICAgICAgICB2YWxUeXBlID0gdGhpcy50eXBlQ2hlY2tlci5nZXRJbmRleFR5cGVPZlR5cGUodHlwZSwgdHMuSW5kZXhLaW5kLk51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy53YXJuKCd1bmtub3duIGluZGV4IGtleSB0eXBlJyk7XG4gICAgICAgICAgcmV0dXJuIGAhT2JqZWN0PD8sPz5gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgIU9iamVjdDwke2tleVR5cGV9LCR7dGhpcy50cmFuc2xhdGUodmFsVHlwZSl9PmA7XG4gICAgICB9IGVsc2UgaWYgKCFjYWxsYWJsZSAmJiAhaW5kZXhhYmxlKSB7XG4gICAgICAgIC8vIFNwZWNpYWwtY2FzZSB0aGUgZW1wdHkgb2JqZWN0IHt9IGJlY2F1c2UgQ2xvc3VyZSBkb2Vzbid0IGxpa2UgaXQuXG4gICAgICAgIC8vIFRPRE8oZXZhbm0pOiByZXZpc2l0IHRoaXMgaWYgaXQgaXMgYSBwcm9ibGVtLlxuICAgICAgICByZXR1cm4gJyFPYmplY3QnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghY2FsbGFibGUgJiYgIWluZGV4YWJsZSkge1xuICAgICAgLy8gTm90IGNhbGxhYmxlLCBub3QgaW5kZXhhYmxlOyBpbXBsaWVzIGEgcGxhaW4gb2JqZWN0IHdpdGggZmllbGRzIGluIGl0LlxuICAgICAgcmV0dXJuIGB7JHtmaWVsZHMuam9pbignLCAnKX19YDtcbiAgICB9XG5cbiAgICB0aGlzLndhcm4oJ3VuaGFuZGxlZCB0eXBlIGxpdGVyYWwnKTtcbiAgICByZXR1cm4gJz8nO1xuICB9XG5cbiAgLyoqIENvbnZlcnRzIGEgdHMuU2lnbmF0dXJlIChmdW5jdGlvbiBzaWduYXR1cmUpIHRvIGEgQ2xvc3VyZSBmdW5jdGlvbiB0eXBlLiAqL1xuICBwcml2YXRlIHNpZ25hdHVyZVRvQ2xvc3VyZShzaWc6IHRzLlNpZ25hdHVyZSk6IHN0cmluZyB7XG4gICAgLy8gVE9ETyhtYXJ0aW5wcm9ic3QpOiBDb25zaWRlciBoYXJtb25pemluZyBzb21lIG92ZXJsYXAgd2l0aCBlbWl0RnVuY3Rpb25UeXBlIGluIHRzaWNrbGUudHMuXG4gICAgY29uc3QgcGFyYW1zID0gdGhpcy5jb252ZXJ0UGFyYW1zKHNpZyk7XG4gICAgbGV0IHR5cGVTdHIgPSBgZnVuY3Rpb24oJHtwYXJhbXMuam9pbignLCAnKX0pYDtcblxuICAgIGNvbnN0IHJldFR5cGUgPSB0aGlzLnRyYW5zbGF0ZSh0aGlzLnR5cGVDaGVja2VyLmdldFJldHVyblR5cGVPZlNpZ25hdHVyZShzaWcpKTtcbiAgICBpZiAocmV0VHlwZSkge1xuICAgICAgdHlwZVN0ciArPSBgOiAke3JldFR5cGV9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHlwZVN0cjtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydFBhcmFtcyhzaWc6IHRzLlNpZ25hdHVyZSk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBwYXJhbVR5cGVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIC8vIFRoZSBTaWduYXR1cmUgaXRzZWxmIGRvZXMgbm90IGluY2x1ZGUgaW5mb3JtYXRpb24gb24gb3B0aW9uYWwgYW5kIHZhciBhcmcgcGFyYW1ldGVycy5cbiAgICAvLyBVc2UgaXRzIGRlY2xhcmF0aW9uIHRvIHJlY292ZXIgdGhhdCBpbmZvcm1hdGlvbi5cbiAgICBjb25zdCBkZWNsID0gc2lnLmRlY2xhcmF0aW9uO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2lnLnBhcmFtZXRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBhcmFtID0gc2lnLnBhcmFtZXRlcnNbaV07XG5cbiAgICAgIGNvbnN0IHBhcmFtRGVjbCA9IGRlY2wucGFyYW1ldGVyc1tpXTtcbiAgICAgIGNvbnN0IG9wdGlvbmFsID0gISFwYXJhbURlY2wucXVlc3Rpb25Ub2tlbjtcbiAgICAgIGNvbnN0IHZhckFyZ3MgPSAhIXBhcmFtRGVjbC5kb3REb3REb3RUb2tlbjtcbiAgICAgIGxldCBwYXJhbVR5cGUgPSB0aGlzLnR5cGVDaGVja2VyLmdldFR5cGVPZlN5bWJvbEF0TG9jYXRpb24ocGFyYW0sIHRoaXMubm9kZSk7XG4gICAgICBpZiAodmFyQXJncykge1xuICAgICAgICBjb25zdCB0eXBlUmVmID0gcGFyYW1UeXBlIGFzIHRzLlR5cGVSZWZlcmVuY2U7XG4gICAgICAgIHBhcmFtVHlwZSA9IHR5cGVSZWYudHlwZUFyZ3VtZW50cyFbMF07XG4gICAgICB9XG4gICAgICBsZXQgdHlwZVN0ciA9IHRoaXMudHJhbnNsYXRlKHBhcmFtVHlwZSk7XG4gICAgICBpZiAodmFyQXJncykgdHlwZVN0ciA9ICcuLi4nICsgdHlwZVN0cjtcbiAgICAgIGlmIChvcHRpb25hbCkgdHlwZVN0ciA9IHR5cGVTdHIgKyAnPSc7XG4gICAgICBwYXJhbVR5cGVzLnB1c2godHlwZVN0cik7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbVR5cGVzO1xuICB9XG5cbiAgd2Fybihtc2c6IHN0cmluZykge1xuICAgIC8vIEJ5IGRlZmF1bHQsIHdhcm4oKSBkb2VzIG5vdGhpbmcuICBUaGUgY2FsbGVyIHdpbGwgb3ZlcndyaXRlIHRoaXNcbiAgICAvLyBpZiBpdCB3YW50cyBkaWZmZXJlbnQgYmVoYXZpb3IuXG4gIH1cblxuICAvKiogQHJldHVybiB0cnVlIGlmIHN5bSBzaG91bGQgYWx3YXlzIGhhdmUgdHlwZSB7P30uICovXG4gIGlzQmxhY2tMaXN0ZWQoc3ltYm9sOiB0cy5TeW1ib2wpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5wYXRoQmxhY2tMaXN0ID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBwYXRoQmxhY2tMaXN0ID0gdGhpcy5wYXRoQmxhY2tMaXN0O1xuICAgIC8vIFNvbWUgYnVpbHRpbiB0eXBlcywgc3VjaCBhcyB7fSwgZ2V0IHJlcHJlc2VudGVkIGJ5IGEgc3ltYm9sIHRoYXQgaGFzIG5vIGRlY2xhcmF0aW9ucy5cbiAgICBpZiAoc3ltYm9sLmRlY2xhcmF0aW9ucyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHN5bWJvbC5kZWNsYXJhdGlvbnMuZXZlcnkobiA9PiB7XG4gICAgICBjb25zdCBmaWxlTmFtZSA9IHBhdGgubm9ybWFsaXplKG4uZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lKTtcbiAgICAgIHJldHVybiBwYXRoQmxhY2tMaXN0LmhhcyhmaWxlTmFtZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==