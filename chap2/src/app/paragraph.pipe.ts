import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paragraph'
})
export class ParagraphPipe implements PipeTransform {

  transform(value: string, paragrapheSymbol:string): string {
    return value.replace(
      new RegExp("\n\r", 'g'),  
  		paragrapheSymbol + "\n\r"
  	);
  }

}
