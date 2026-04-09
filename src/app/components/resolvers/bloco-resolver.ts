import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BlocoService } from '../../services/bloco.service';
import { Bloco } from '../../models/bloco.model';

export const blocoResolver: ResolveFn<Bloco> = (route) => {
  return inject(BlocoService).findById(route.paramMap.get('id'));
};
