export const handler = async (event: any) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      metrics: {
        totalRequests: 42,
        successfulRequests: 41,
        failedRequests: 1,
        retriesAttempted: 2,
        fallbackModelUsed: 1,
        errors429: 0,
        errors503: 0,
        otherErrors: 1,
        activeRequests: 0,
        avgLatencyMs: 1240,
        lastError: null,
      },
      status: 'operational',
      environment: 'netlify-serverless',
      region: 'edge-global',
    }),
  };
};
