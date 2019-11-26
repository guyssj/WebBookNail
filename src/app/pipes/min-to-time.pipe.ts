import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minToTime'
})
export class MinToTimePipe implements PipeTransform {
  transform(value: number, args?: any) {
    if(!isNaN(value)){
      let hours = Math.floor(value / 60);
      let minutes = Math.floor((value - ((hours * 3600)) / 60));
      let seconds = Math.floor((value * 60) - (hours * 3600) - (minutes * 60));
  
      // Appends 0 when unit is less than 10
      if (hours < 10) {
        var newH = "0" + hours;
      } else {
        newH = hours.toString();
      }
      if (minutes < 10) {
        var newMin = "0" + minutes;
      }
      else {
        newMin = minutes.toString();
      }
      if (seconds < 10) { var newSec = "0" + seconds; }
  
      return newH + ':' + newMin;
    }
    else{
      return value;
    }
  }

}
