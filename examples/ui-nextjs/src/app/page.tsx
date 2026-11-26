import { Alert, Button, Heading, Stack, Switch, TextField } from '@k8ordo/ui';

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-8">
      <Stack direction="column" gap="lg">
        <Heading level="h1">k8ordo UI × Next.js</Heading>
        <Alert
          message="このページは Server Component です。中の部品はそのまま描画できます。"
          tone="success"
        />
        <form>
          <Stack direction="column" gap="md">
            <TextField
              aria-label="ニックネーム"
              name="nickname"
              placeholder="ニックネーム"
            />
            <Switch defaultChecked label="通知を受け取る" name="notify" />
            <Button type="submit" variant="solid">
              保存
            </Button>
          </Stack>
        </form>
      </Stack>
    </div>
  );
}
