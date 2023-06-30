import * as core from '@actions/core'
import { run, getInputs } from '../src/action'

run(getInputs()).catch((err: Error) => { core.setFailed(err.stack ?? err.message) })
