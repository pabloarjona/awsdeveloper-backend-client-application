import {
  CloudWatchClient,
  PutMetricDataCommand
} from '@aws-sdk/client-cloudwatch'
import axios from 'axios'

// Name of a service, any string
const serviceName = process.env.SERVICE_NAME
// URL of a service to test
const url = process.env.URL

// CloudWatch client
const cloudwatch = new CloudWatchClient()

export async function handler(event) {
  // TODO: Use these variables to record metric values
  let endTime
  let requestWasSuccessful

  const startTime = timeInMs()
  try{
    await axios.get(url)
    requestWasSuccessful = true
  } catch (error) {
    requestWasSuccessful = false
  } finally {
    endTime = timeInMs()
  }
  const totalTime = endTime - startTime
  const successMetricCommand = new PutMetricDataCommand({
      MetricData: [
        {
          MetricName: 'Success', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
          Dimensions: [
            {
              Name: 'ServiceName',
              Value: serviceName
            }
          ],
          Unit: 'Count', // 'Count' or 'Milliseconds'
          Value: requestWasSuccessful ? 1 : 0 // Total value
        }
      ],
      Namespace: 'Udacity/Serveless'
  });
  await cloudwatch.send(successMetricCommand);

  const latencyMetricCommand = new PutMetricDataCommand({
      MetricData: [
        {
          MetricName: 'Latency', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
          Dimensions: [
            {
              Name: 'ServiceName',
              Value: serviceName
            }
          ],
          Unit: 'Milliseconds', // 'Count' or 'Milliseconds'
          Value: totalTime // Total value
        }
      ],
      Namespace: 'Udacity/Serveless'
  });
  await cloudwatch.send(latencyMetricCommand);
  // TODO: Record time it took to get a response
  // TODO: Record if a response was successful or not
}

function timeInMs() {
  return new Date().getTime()
}