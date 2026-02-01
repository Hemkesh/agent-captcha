import { verifyJWT } from '@/lib/jwt';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, HelpCircle, ArrowLeft } from 'lucide-react';

interface SearchParams {
  token?: string;
}

export default async function Success({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const token = params.token;
  const secret = process.env.CAPTCHA_SECRET;

  if (!token) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">No Token Provided</h1>
            <p className="text-muted-foreground mb-6">
              No verification token was found in the URL.
            </p>
            <Button asChild>
              <Link href="/demo">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!secret) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Configuration Error</h1>
            <p className="text-muted-foreground mb-6">
              CAPTCHA_SECRET environment variable is not set.
            </p>
            <Card className="bg-muted/50 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Raw Token (unverified)</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-xs break-all">{token}</code>
              </CardContent>
            </Card>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const result = verifyJWT(token, secret);

  if (!result.valid) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p className="text-muted-foreground mb-6">
              The token could not be verified: {result.error}
            </p>
            <Card className="bg-muted/50 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Token</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-xs break-all">{token.substring(0, 50)}...</code>
              </CardContent>
            </Card>
            <Button asChild>
              <Link href="/demo">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const payload = result.payload!;
  const completedDate = new Date(payload.completedAt).toLocaleString();
  const expiresDate = new Date(payload.exp * 1000).toLocaleString();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verification Complete</h1>
          <p className="text-muted-foreground mb-6">
            You have successfully proven you're not human.
          </p>

          <Badge className="mb-6 bg-green-500/10 text-green-500 hover:bg-green-500/20">
            VERIFIED
          </Badge>

          <div className="space-y-4 text-left">
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Session ID</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-sm">{payload.sessionId}</code>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Completed At</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-sm">{completedDate}</span>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Token Expires</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-sm">{expiresDate}</span>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">JWT Token</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-xs break-all">{token}</code>
              </CardContent>
            </Card>
          </div>

          <Button variant="outline" className="mt-6" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
