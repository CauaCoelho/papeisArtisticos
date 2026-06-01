import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MarcaService } from '../../services/marca.service';
import { Marca } from '../../models/marca.model';

export const marcaResolver: ResolveFn<Marca> = (route, state) => {
    return inject(MarcaService).findById(+route.paramMap.get('id')!);
};
