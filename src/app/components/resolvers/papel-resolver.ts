import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SketchbookService } from '../../services/sketchbook.service';
import { Sketchbook } from '../../models/sketchbook.model';

export const sketchbookResolver: ResolveFn<Sketchbook> = (route, state) => {
  return inject(SketchbookService).findById(route.paramMap.get('id'));
};
