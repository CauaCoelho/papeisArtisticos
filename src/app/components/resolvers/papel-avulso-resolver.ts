import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PapelAvulsoService } from '../../services/papel-avulso.service';
import { PapelAvulso } from '../../models/papel-avulso.model';

export const papelAvulsoResolver: ResolveFn<PapelAvulso> = (route) => {
  return inject(PapelAvulsoService).findById(route.paramMap.get('id'));
};
