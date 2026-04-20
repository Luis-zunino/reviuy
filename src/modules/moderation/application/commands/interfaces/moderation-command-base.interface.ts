import { RateLimitType } from '@/lib';
import { ModerationCommandRepository } from '@/modules/moderation/domain';

/**
 * Interfaz base para inyectar dependencias en comandos de moderación.
 *
 * Define las capacidades requeridas por los casos de uso de moderación,
 * permitiendo acceder al usuario autenticado, aplicar límites de tasa,
 * y ejecutar operaciones del dominio a través del repositorio.
 */
export interface ModerationCommandBase {
  /**
   * Obtiene el ID del usuario autenticado en la sesión actual.
   * @returns Promise que resuelve al ID del usuario o null si no hay autenticación.
   */
  getCurrentUserId: () => Promise<string | null>;

  /**
   * Aplica rate limiting a una operación específica.
   * @param key - Identificador único para agrupar intentos (ej: user_id, IP)
   * @param scope - Alcance del límite (ej: PER_USER, PER_IP)
   * @throws Error si se exceden los límites configurados para el scope
   */
  rateLimit: (key: string, scope: RateLimitType) => Promise<void>;

  /**
   * Repositorio de comandos para operaciones de moderación.
   * Maneja la persistencia y lógica de dominio relacionada con reportes y acciones.
   */
  repository: ModerationCommandRepository;
}
