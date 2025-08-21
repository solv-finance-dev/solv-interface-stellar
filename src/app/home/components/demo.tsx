import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@solvprotocol/ui-v2";

const Demo = () => {
  return (
    <div className="p-4">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Username" />
          <Input type="password" placeholder="Password" />
          <Button className="w-full">Login</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Demo;
