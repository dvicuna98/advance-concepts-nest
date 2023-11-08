import { ContextId, ContextIdFactory, ContextIdResolver, ContextIdResolverFn, ContextIdStrategy, HostComponentInfo } from "@nestjs/core";
import { Request } from 'express';

export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {

  private readonly tenants = new Map<string, ContextId>;

    attach(
      contextId: ContextId,
      request: Request
    ): ContextIdResolverFn | ContextIdResolver {
        const tenatId = request.headers['x-tenant-id'] as string;

        if(!tenatId){
          // OR log error depending on what we want to accomplish
          return () => contextId;
        }

        let tenatSubTreeId: ContextId;

        if(this.tenants.has(tenatId)){
          tenatSubTreeId = this.tenants.get(tenatId);
        }else{
          tenatSubTreeId = ContextIdFactory.create();
          this.tenants.set(tenatId, tenatSubTreeId);
          setTimeout(() => this.tenants.delete(tenatId), 3000);
        }

        return {
          payload: {
            tenatId
          },
          resolve: (info: HostComponentInfo) =>
            info.isTreeDurable ? tenatSubTreeId: contextId
        }
    }
}