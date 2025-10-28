---
layout: blog.pug
tags:
  - posts
  - github actions
  - recipes
  - CI/CD
  - gh-cli
  - act-cli
date: 2023-12-13
draft: false
---
# Simple recipes for GitHub actions

Today we will talk about pipelines.

Well, to be specific, how we write pipelines nowadays.

## What is a workflow

A workflow file is what happens when bash scripts and yaml files decide to bear
a child.

Those files lies in your github project inside a folder called
[.github/workflows][.github/workflows] and are able to perform shell commands.

If you have a certain set of shell commands (bash, but you can set any supported
shell, see [here][configure-shell].) to test, build and publish your application
then you can transform it into a workflow. You can also condition the execution
of this workflow to a certain event, let's say on every push, performing proper
code integration.

You script can be declared as one or more jobs, containing one or more steps,
able to checking in previous results to decide what to do next.

Jobs run in **parallel** by default.

## The simplest possible action

Simplest action possible is an _echo "hello world"_, like in bash:

```yaml
name: 00 - Hello world!

on:
    workflow_dispatch: 

jobs:
    hello-world:
        runs-on: ubuntu-latest
        steps:
            - run: echo "hello world!"
```

### Basic action structure

We can spot the three key elements that must figure in every GitHub action:

- **name**: unique name for your workflow. They are not supposed to repeat.
- **on.workflow_dispatch**: the event triggering the workflow. There are
  [several][wf-trigger] ways to trigger a workflow, but the most common are the
  ones involving a **push**. In the example above, we're using the event
  triggered [manually][event-manual-trigger].
- **jobs**: The list of jobs needed in this workflow. You define the name of the
  jobs. Be creative, don't just name it _build_. di i mention that jobs run in
  parallel by default?
- **steps**: What must be executed in order to realize a job. One step takes on
  where the previous one finished. If a step fails, the job fail, unless you
  [say otherwise][step-continue].

## Ways to combine workflows

You can get somewhat creative when authoring pipelines. You can reuse scripts,
chain them, even condition execution based on previous steps.

### Uses

This is when you want a job to do everything another workflow does:

```yaml
name: 04 - Use another workflow

on:
    workflow_dispatch: 

jobs:
    use-sequence-workflow:
        uses: ./.github/workflows/03-sequence-jobs.yml
```

In example above, the job in the workflow calls all jobs from previous one.

It is possible to pass [some context][uses-with] to those jobs.

### Needs

Use it to chain jobs. If a job needs another, they play in sequence. It's very
similar behavior as put all steps into a single job:

```yaml
name: 03 - Sequence jobs

on:
    workflow_dispatch:
    workflow_call:

jobs:
    job-one:
        runs-on: ubuntu-latest
        steps:
            - run: echo "hello first!"
    
    job-two:
        runs-on: ubuntu-latest
        needs: [job-one]           
        steps:
            - run: echo "hello second!"
```

You can either provide a single job as needed or a list of jobs.

### Inputs and outputs

Jobs can interact with each other. To do so, they can get [inputs][event-inputs]
from events and emit [outputs][job-outputs].

Events that can get inputs are the [workflow_dispatch][ev-dispatch], which is
when you call it by hand and the [workflow_call][ev-call], which is when one job
calls another, as we seen in the previous examples.

This is an example of a workflow consuming inputs:

{% raw %}

```yaml
name: 05 - Job Inputs

on:
  workflow_dispatch: 
    inputs:
      anything:
        type: string
        required: false
        default: 'is possible'

jobs:
  using-input-from-dispatch:
    runs-on: ubuntu-latest
    steps:
      - run: echo 'If you believe, anything ${{inputs.anything}}!'
```

{% endraw %}

And this is a job producing outputs:

{% raw %}

```yaml
name: 06 - Job outputs

on:
  workflow_dispatch: 

jobs:
  simple-output:
    runs-on: ubuntu-latest
    outputs:
      my-output: 'general kenobi!'
    steps:
      - run: echo "hello there!"
  
  use-simple-output:
    runs-on: ubuntu-latest
    needs: simple-output
    steps:
      - run: echo "${{needs.simple-output.outputs.my-output}}"
  
  output-from-step:
    runs-on: ubuntu-latest
    outputs:
      from-step-2: ${{ steps.step2.outputs.custom_result }}
    steps:
      - id: step2
        run: echo "custom_result=$(date +'%Y')" >> $GITHUB_OUTPUT
      
  use-output-from-step:
    runs-on: ubuntu-latest
    needs: [output-from-step]
    steps:
      - run: echo "i got a dynamic value from ${{needs.output-from-step.outputs.from-step-2}}"
```

{% endraw %}

You can map [workflow outputs][event-output] at event level ina similar way the
outputs at step level are mapped, so other workflows using this job can access
produced outputs with no trouble.

## Variables

Variables are a way to tweak workflow behavior by setting values external to the
event context:

{% raw %}

```yaml
name: 07 - Environment variables
on:
    workflow_dispatch: 
env:
    A: 'a reasonable value'
jobs:
    use-one-variable:
        runs-on: ubuntu-latest
        steps:
            - run: echo "${{vars.X}}" # gh variable set X or .vars file for act
    use-another-variable:
        runs-on: ubuntu-latest
        steps:
            - run: echo "${{env.A}}"
    use-another-one:
        runs-on: ubuntu-latest
        env:
            B: 'my other value'
        steps:
            - run: echo "${{env.B}}"
    and-another:
        runs-on: ubuntu-latest
        steps:
            - run: echo "${{env.C}}"
              env:
                C: 'other'
            - run: echo "I have access to X and A, ${{vars.X}} ${{env.A}}"
            - run: echo "I don't have access to C or B, ${{env.B}} ${{env.C}}"
    about-redefines:
        runs-on: ubuntu-latest
        env:
            A: 'redefined!'
        steps:
            - run: echo "I am using a redefined A, ${{env.A}}"
```

{% endraw %}

It is possible creating variables on project configurations either using web
interface or the [GitHub CLI][gh-cli].

Another cool tool to play with actions is [act-cli][act-cli]. It's almost 100%
compatible with the real thing, but it's good enough to avoid perform several
commits when creating a pipeline. Your coworkers mailboxes will be glad!

It is possible to define environment variables at workflow level, job level and
step level.

## Secrets

Secrets are like vars and env but for secrets. The neat touch is they don't echo
on [workflow execution logs][wf-run-logs]:

{% raw %}

```yaml
name: 08 - Using secrets

on:
    workflow_dispatch: 

jobs:
    ill-tell-u-a-secret:
        runs-on: ubuntu-latest
        steps:
            - run: echo "my secret is ${{secrets.MY_SECRET}}"
              # gh secret set MY_SECRET
              # or create a .env file if using act
            - run: | 
                echo "secret doesn't echo, but go ahead and use them!"
                echo $(( 10 + ${{secrets.X}}))
```

{% endraw %}

## Conclusion

These samples are quite simple by design, but combine them and you can create
neat pipelines. Run your tests, package libraries and app images, publish, see
the [marketplace][the-marketplace] for more interesting examples and ways to
build pipelines.

You can find sample actions [in this repo][git-repo]

[.github/workflows]: https://github.com/sombriks/gh-actions-playground/tree/main/.github/workflows
[configure-shell]: https://docs.github.com/en/actions/using-jobs/setting-default-values-for-jobs#setting-default-shell-and-working-directory
[wf-trigger]: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
[event-manual-trigger]: https://github.com/sombriks/gh-actions-playground?tab=readme-ov-file#00---smallest-possible
[step-continue]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepscontinue-on-error
[uses-with]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-of-jobsjob_idwith
[event-inputs]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputs
[job-outputs]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idoutputs
[ev-dispatch]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_dispatch
[ev-call]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_call
[event-output]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_calloutputs
[gh-cli]: https://cli.github.com/
[act-cli]: https://github.com/nektos/act
[wf-run-logs]: https://github.com/sombriks/gh-actions-playground/actions/runs/7189689267/job/19581621041#step:3:2
[the-marketplace]: https://github.com/marketplace?type=actions
[git-repo]: https://github.com/sombriks/gh-actions-playground
