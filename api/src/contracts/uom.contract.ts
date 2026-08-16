import * as Entity from '@/entities/uom.entity'

export interface IUomRepo {
  createUom(req: Entity.CreateUomReq): Promise<Entity.UnitOfMeasurement>
  findUomList(req: Entity.GetUomReq): Promise<Entity.UomList>
  updateUom(req: Entity.UpdateUomReq): Promise<Entity.UnitOfMeasurement | null>

  createConversion(req: Entity.CreateUnitConversionReq): Promise<Entity.UnitConversion>
  findConversionList(req: Entity.GetUomReq): Promise<Entity.UnitConversionList>
  updateConversion(req: Entity.UpdateUnitConversionReq): Promise<Entity.UnitConversion | null>
}

export interface IUomUsecase {
  createUom(req: Entity.CreateUomReq): Promise<Entity.UnitOfMeasurement>
  findUomList(req: Entity.GetUomReq): Promise<Entity.UomList>
  updateUom(req: Entity.UpdateUomReq): Promise<Entity.UnitOfMeasurement>

  createConversion(req: Entity.CreateUnitConversionReq): Promise<Entity.UnitConversion>
  findConversionList(req: Entity.GetUomReq): Promise<Entity.UnitConversionList>
  updateConversion(req: Entity.UpdateUnitConversionReq): Promise<Entity.UnitConversion>
}
