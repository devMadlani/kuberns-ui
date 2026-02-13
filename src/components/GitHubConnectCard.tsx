import { GitBranch, Github } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface GitHubConnectCardProps {
  githubConnected: boolean;
  githubUsername: string;
  gitlabConnected: boolean;
  githubLoading: boolean;
  githubError: string | null;
  onGithubConnect: () => void;
  onGitlabConnect: () => void;
}

export function GitHubConnectCard({
  githubConnected,
  githubUsername,
  gitlabConnected,
  githubLoading,
  githubError,
  onGithubConnect,
  onGitlabConnect,
}: GitHubConnectCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Choose your Version Control System</CardTitle>
          <a href="#" className="text-sm text-primary hover:underline">
            Need Help?
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button
            variant={githubConnected ? 'default' : 'outline'}
            className={`flex-1 h-auto py-4 px-6 flex items-center justify-between ${
              githubConnected ? 'bg-primary text-white' : ''
            }`}
            onClick={onGithubConnect}
            disabled={githubLoading}
          >
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5" />
              <span className="font-medium">
                {githubLoading ? 'Connecting...' : githubConnected ? 'Reconnect Github' : 'Connect Github'}
              </span>
            </div>
            {githubConnected ? (
              <Badge variant="success" className="bg-green-500">
                CONNECTED
              </Badge>
            ) : (
              <Badge variant="outline">NOT CONNECTED</Badge>
            )}
          </Button>

          <Button
            variant={gitlabConnected ? 'default' : 'outline'}
            className={`flex-1 h-auto py-4 px-6 flex items-center justify-between ${
              gitlabConnected ? 'bg-primary text-white' : ''
            }`}
            onClick={onGitlabConnect}
          >
            <div className="flex items-center gap-3">
              <GitBranch className="h-5 w-5" />
              <span className="font-medium">Gitlab</span>
            </div>
            {gitlabConnected ? (
              <Badge variant="success" className="bg-green-500">
                CONNECTED
              </Badge>
            ) : (
              <Badge variant="outline">NOT CONNECTED</Badge>
            )}
          </Button>
        </div>

        {githubConnected && githubUsername ? (
          <p className="text-sm text-muted-foreground">Connected as @{githubUsername}</p>
        ) : null}

        {githubError ? <p className="text-sm text-destructive">{githubError}</p> : null}
      </CardContent>
    </Card>
  );
}
