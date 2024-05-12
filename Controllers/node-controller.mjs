import { blockchain } from '../init-app.mjs';

export const listNodes = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, statusCode: 200, data: blockchain.networkNodes });
};

export const registerNode = (req, res, next) => {
  const node = req.body;

  if (
    blockchain.networkNodes.indexOf(node.nodeUrl) === -1 &&
    blockchain.nodeUrl !== node.nodeUrl
  ) {
    blockchain.networkNodes.push(node.nodeUrl);

    syncNodes(node.nodeUrl);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: `Noden ${req.body.nodeUrl} är registrerad `,
    });
  } else {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: `Node ${node.nodeUrl} är redan registrerad`,
    });
  }
};

const syncNodes = (url) => {
  const nodes = [...blockchain.networkNodes, blockchain.nodeUrl];
  console.log(nodes);

  try {
    nodes.forEach(async (node) => {
      const body = { nodeUrl: node };
      await fetch(`${url}/api/v1/nodes/register-node`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};
