import { UsuarioEffects } from './usuario.effects';
import { UsuariosEffects } from './usuarios.effects';
import { PerfilEffects } from './perfil.effects';
import { ProveedorEffects } from './proveedor.effects';
import { ClientesEffects } from './clientes.effects';

export const effectsArr: any[] = [
  UsuarioEffects, UsuariosEffects, PerfilEffects, ProveedorEffects, ClientesEffects
];

export * from './usuario.effects';
export * from './usuarios.effects';
export * from './perfil.effects';
export * from './proveedor.effects';
export * from './clientes.effects';
