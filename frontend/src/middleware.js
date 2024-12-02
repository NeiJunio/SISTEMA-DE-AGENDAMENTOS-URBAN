import { NextResponse } from 'next/server';

export function middleware(req) {
  // Obter o token de autenticação do cookie
  const token = req.cookies.get('token'); // Certifique-se de que o cookie 'token' está sendo enviado com a requisição

  // Defina as rotas que deseja proteger
  const protectedRoutes = ['/telas/admin', '/telas/usuario']; // Rotas privadas

  // Verifica se a rota acessada é protegida
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    // Se o token não existir, redireciona para a página de login
    if (!token) {
      return NextResponse.redirect(new URL('/telas/login', req.url));
    }
  }

  // Se o usuário tiver o token, permite a navegação
  return NextResponse.next();
}

export const config = {
  matcher: ['/telas/admin', '/telas/usuario'], // Apenas as rotas principais
};
