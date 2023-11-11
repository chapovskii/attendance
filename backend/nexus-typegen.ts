/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */







declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  Mutation: {};
  Profile: { // root type
    adminRole: boolean; // Boolean!
    email: string; // String!
    login: string; // String!
    name: string; // String!
    phone: string; // String!
    position: string; // String!
  }
  Query: {};
  Record: { // root type
    brk_hrs?: number | null; // Int
    cfbreak?: number | null; // Int
    date: string; // String!
    end?: string | null; // String
    login: string; // String!
    name?: string | null; // String
    start?: string | null; // String
    status: boolean; // Boolean!
    wrk_hrs?: number | null; // Int
  }
  RecordWOpt: { // root type
    adminRole: boolean; // Boolean!
    options: string; // String!
    recordData: NexusGenRootTypes['Record']; // Record!
  }
  RecordsIssues: { // root type
    fix_required?: Array<NexusGenRootTypes['Record'] | null> | null; // [Record]
    suspicious?: Array<NexusGenRootTypes['Record'] | null> | null; // [Record]
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Mutation: { // field return type
    correctRecord: boolean; // Boolean!
    createProfile: boolean; // Boolean!
    deleteProfile: boolean; // Boolean!
    setRecord: boolean; // Boolean!
    updateProfile: boolean; // Boolean!
  }
  Profile: { // field return type
    adminRole: boolean; // Boolean!
    email: string; // String!
    login: string; // String!
    name: string; // String!
    phone: string; // String!
    position: string; // String!
  }
  Query: { // field return type
    dailyRecords: Array<NexusGenRootTypes['Record'] | null> | null; // [Record]
    loadRecordForSet: NexusGenRootTypes['RecordWOpt'] | null; // RecordWOpt
    login: boolean; // Boolean!
    monthlyRecords: Array<NexusGenRootTypes['Record'] | null> | null; // [Record]
    recordsIssues: NexusGenRootTypes['RecordsIssues'] | null; // RecordsIssues
    userList: Array<NexusGenRootTypes['Profile'] | null> | null; // [Profile]
  }
  Record: { // field return type
    brk_hrs: number | null; // Int
    cfbreak: number | null; // Int
    date: string; // String!
    end: string | null; // String
    login: string; // String!
    name: string | null; // String
    start: string | null; // String
    status: boolean; // Boolean!
    wrk_hrs: number | null; // Int
  }
  RecordWOpt: { // field return type
    adminRole: boolean; // Boolean!
    options: string; // String!
    recordData: NexusGenRootTypes['Record']; // Record!
  }
  RecordsIssues: { // field return type
    fix_required: Array<NexusGenRootTypes['Record'] | null> | null; // [Record]
    suspicious: Array<NexusGenRootTypes['Record'] | null> | null; // [Record]
  }
}

export interface NexusGenFieldTypeNames {
  Mutation: { // field return type name
    correctRecord: 'Boolean'
    createProfile: 'Boolean'
    deleteProfile: 'Boolean'
    setRecord: 'Boolean'
    updateProfile: 'Boolean'
  }
  Profile: { // field return type name
    adminRole: 'Boolean'
    email: 'String'
    login: 'String'
    name: 'String'
    phone: 'String'
    position: 'String'
  }
  Query: { // field return type name
    dailyRecords: 'Record'
    loadRecordForSet: 'RecordWOpt'
    login: 'Boolean'
    monthlyRecords: 'Record'
    recordsIssues: 'RecordsIssues'
    userList: 'Profile'
  }
  Record: { // field return type name
    brk_hrs: 'Int'
    cfbreak: 'Int'
    date: 'String'
    end: 'String'
    login: 'String'
    name: 'String'
    start: 'String'
    status: 'Boolean'
    wrk_hrs: 'Int'
  }
  RecordWOpt: { // field return type name
    adminRole: 'Boolean'
    options: 'String'
    recordData: 'Record'
  }
  RecordsIssues: { // field return type name
    fix_required: 'Record'
    suspicious: 'Record'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    correctRecord: { // args
      date: string; // String!
      login: string; // String!
      value: number; // Int!
    }
    createProfile: { // args
      adminRole: boolean; // Boolean!
      email: string; // String!
      login: string; // String!
      name: string; // String!
      phone: string; // String!
      position: string; // String!
    }
    deleteProfile: { // args
      login: string; // String!
    }
    setRecord: { // args
      login: string; // String!
      process: string; // String!
    }
    updateProfile: { // args
      adminRole: boolean; // Boolean!
      email: string; // String!
      login: string; // String!
      name: string; // String!
      phone: string; // String!
      position: string; // String!
    }
  }
  Query: {
    loadRecordForSet: { // args
      login: string; // String!
    }
    login: { // args
      login: string; // String!
    }
    monthlyRecords: { // args
      date: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}