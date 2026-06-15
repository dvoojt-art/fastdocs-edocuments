export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(message: string, context: SecurityRuleContext) {
    
    // Calling super() first is mandatory in TypeScript/JavaScript classes
    super(message);
    
    // Ensure the name is set correctly for better debugging
    this.name = "FirestorePermissionError";
    this.context = context;

    // Set the prototype explicitly for extending built-in Error in some environments
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
