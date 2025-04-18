/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LandingImport } from './routes/landing'
import { Route as JoinImport } from './routes/join'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as IndexImport } from './routes/index'
import { Route as AuthenticatedLobbyImport } from './routes/_authenticated/lobby'

// Create/Update Routes

const LandingRoute = LandingImport.update({
  id: '/landing',
  path: '/landing',
  getParentRoute: () => rootRoute,
} as any)

const JoinRoute = JoinImport.update({
  id: '/join',
  path: '/join',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedLobbyRoute = AuthenticatedLobbyImport.update({
  id: '/lobby',
  path: '/lobby',
  getParentRoute: () => AuthenticatedRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/join': {
      id: '/join'
      path: '/join'
      fullPath: '/join'
      preLoaderRoute: typeof JoinImport
      parentRoute: typeof rootRoute
    }
    '/landing': {
      id: '/landing'
      path: '/landing'
      fullPath: '/landing'
      preLoaderRoute: typeof LandingImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/lobby': {
      id: '/_authenticated/lobby'
      path: '/lobby'
      fullPath: '/lobby'
      preLoaderRoute: typeof AuthenticatedLobbyImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedRouteChildren {
  AuthenticatedLobbyRoute: typeof AuthenticatedLobbyRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedLobbyRoute: AuthenticatedLobbyRoute,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof AuthenticatedRouteWithChildren
  '/join': typeof JoinRoute
  '/landing': typeof LandingRoute
  '/lobby': typeof AuthenticatedLobbyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof AuthenticatedRouteWithChildren
  '/join': typeof JoinRoute
  '/landing': typeof LandingRoute
  '/lobby': typeof AuthenticatedLobbyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/join': typeof JoinRoute
  '/landing': typeof LandingRoute
  '/_authenticated/lobby': typeof AuthenticatedLobbyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '' | '/join' | '/landing' | '/lobby'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/join' | '/landing' | '/lobby'
  id:
    | '__root__'
    | '/'
    | '/_authenticated'
    | '/join'
    | '/landing'
    | '/_authenticated/lobby'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  JoinRoute: typeof JoinRoute
  LandingRoute: typeof LandingRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  JoinRoute: JoinRoute,
  LandingRoute: LandingRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_authenticated",
        "/join",
        "/landing"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/lobby"
      ]
    },
    "/join": {
      "filePath": "join.tsx"
    },
    "/landing": {
      "filePath": "landing.tsx"
    },
    "/_authenticated/lobby": {
      "filePath": "_authenticated/lobby.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
