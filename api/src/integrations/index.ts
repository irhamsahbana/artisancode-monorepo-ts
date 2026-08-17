import { DokuIntegration } from '@/adapter/secondary/rest/doku'
import { PokemonIntegration } from '@/adapter/secondary/rest/pokemon'
import {
  IEmailService,
  IPaymentGateway,
  IPokemonService,
  IStorageService,
} from '@/contracts/integration'

import { MockEmailService } from './email'
import { StorageIntegration } from './storage'

// Factory functions — each module calls these to get integration instances

export function createPaymentGateway(): IPaymentGateway {
  return new DokuIntegration()
}

export function createEmailService(): IEmailService {
  return new MockEmailService()
}

export function createStorageService(): IStorageService {
  return new StorageIntegration()
}

export function createPokemonService(): IPokemonService {
  return new PokemonIntegration()
}
