export function loginLoader({request}: {request: Request}) {
  return new URL(request.url).searchParams.get("message");
}