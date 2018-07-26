/// <amd-module name="tsickle/src/fileoverview_comment_transformer" />
import * as ts from './typescript';
/**
 * A transformer that ensures the emitted JS file has an \@fileoverview comment that contains an
 * \@suppress {checkTypes} annotation by either adding or updating an existing comment.
 */
export declare function transformFileoverviewComment(context: ts.TransformationContext): (sf: ts.SourceFile) => ts.SourceFile;
