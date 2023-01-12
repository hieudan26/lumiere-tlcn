import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CookieConstants } from './constants/store.constant';
import { adminRouteContain, authRouteContain, privateRouteContain, publicRouteContain } from './utils';
import { RoleConstants } from './constants/roles.constant';
// import jsonwebtoken from 'jsonwebtoken';
// import jwkToPem from 'jwk-to-pem';

interface jsonWK {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

const jsonWebKeys = [
  {
    alg: '',
    e: '',
    kid: '',
    kty: '',
    n: '',
    use: '',
  },
  {
    alg: '',
    e: '',
    kid: '',
    kty: '',
    n: '',
    use: '',
  },
];
/*
function validateToken(token: string) {
  const header = decodeTokenHeader(token);
  const jsonWebKey = getJsonWebKeyWithKID(header.kid);
  if (jsonWebKey) {
    verifyJsonWebTokenSignature(token, jsonWebKey, (err: any, decodedToken: any) => {
      if (err) {
        console.error(err);
        return null;
      } else {
        console.log(decodedToken);
        return decodedToken;
      }
    });
  } else {
    return null;
  }
}

function decodeTokenHeader(token: string) {
  const [headerEncoded] = token.split('.');
  const buff = new Buffer(headerEncoded, 'base64');
  const text = buff.toString('ascii');
  return JSON.parse(text);
}

function getJsonWebKeyWithKID(kid: string) {
  for (let jwk of jsonWebKeys) {
    if (jwk.kid === kid) {
      return jwk;
    }
  }
  return null;
}

function verifyJsonWebTokenSignature(token: string, jsonWebKey: any, clbk: any) {
  const pem = jwkToPem(jsonWebKey);
  jsonwebtoken.verify(token, pem, { algorithms: ['RS256'] }, (err, decodedToken) => clbk(err, decodedToken));
}
*/

const checkAdminRoute = (pathname: string) => {
  var isExisted = false;
  adminRouteContain.forEach((item) => {
    if (pathname.includes(item)) {
      isExisted = true;
      return isExisted;
    }
  });
  return isExisted;
};

const checkPublicRoute = (pathname: string) => {
  var isExisted = false;
  publicRouteContain.forEach((item) => {
    if (pathname.includes(item)) {
      isExisted = true;
      return isExisted;
    }
  });
  return isExisted;
};

const checkAuthRoute = (pathname: string) => {
  var isExisted = false;
  authRouteContain.forEach((item) => {
    if (pathname.includes(item)) {
      isExisted = true;
      return isExisted;
    }
  });
  return isExisted;
};

const checkPrivateRoute = (pathname: string) => {
  var isExisted = false;
  privateRouteContain.forEach((item) => {
    if (pathname.includes(item)) {
      isExisted = true;
      return isExisted;
    }
  });
  return isExisted;
};

export function middleware(request: NextRequest) {
  const role = request.cookies.get(CookieConstants.ROLE);
  const url = request.nextUrl.clone();
  if (url.pathname === '/') {
    if (!role) {
      return NextResponse.redirect(new URL('/experiences', request.url));
    } else if (role === RoleConstants.ADMIN) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/experiences', request.url));
    }
  }

  const token = request.cookies.get(CookieConstants.ACCESS_TOKEN);
  if (token) {
    if (!role) {
      return NextResponse.redirect(new URL('/experiences', request.url));
    } else if (role === RoleConstants.USER) {
      if (checkAuthRoute(url.pathname) || checkAdminRoute(url.pathname)) {
        return NextResponse.redirect(new URL('/experiences', request.url));
      } else {
        return NextResponse.next();
      }
    } else {
      if (checkAuthRoute(url.pathname) || checkPrivateRoute(url.pathname)) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else {
        return NextResponse.next();
      }
    }
  } else {
    if (checkPublicRoute(url.pathname)) {
      return NextResponse.next();
    } else {
      if (checkPrivateRoute(url.pathname) || checkAdminRoute(url.pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
      } else {
        return NextResponse.next();
      }
    }
  }
}
