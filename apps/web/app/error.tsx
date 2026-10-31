"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";

const ErrorPage = ({ error, retry }: { error: unknown; retry: () => void }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto w-100">
      <CardHeader>
        <CardTitle>Couldn&apos;t load your todos</CardTitle>
        <CardDescription>
          Something went wrong while talking to the server. Check that the API
          is running, then try again.
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button type="button" onClick={() => retry()}>
          Try again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ErrorPage;
