export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(
    message: string,
    context: SecurityRuleContext
  ) {
    super(message);
    // Explicitly set the prototype to ensure proper inheritance in all environments
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
    this.name = "FirestorePermissionError";
    this.context = context;
  }
}
