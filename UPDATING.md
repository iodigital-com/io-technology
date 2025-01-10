# Updating Dependencies

> Thank you for keeping the iO Techhub dependencies up-to-date. You are helping us keep up with the latest developments and security updates.

To keep the dependencies up-to-date we use `npm-check-updates`. Each version range (`major`.`minor`.`patch`) has its own script and configuration. Below are a few steps to take to make updating an easy task.

## The steps

1. Update Node to the latest stable version
1. Open the [update patch versions config](./.ncurc.patch.cjs)
   1. Review each dependency in the `reject` array, if available, and see if you can remove it
   1. Run `npm run update:patch` in the project root
   1. See if there are any issues with the new updates
   1. Fix any issues you encounter
      1. If you somehow can't fix it, upgrade the dependency to the highest version which doesn't have the issue
         Sometimes you can resolve it by updating to the next version range (`patch` -> `minor` -> `major`) 1. Add it to the `reject` array 1. Add a comment on why you rejected it
      1. Go back to step 2.2
1. Repeat the above step for [minor version config](./.ncurc.minor.cjs)
1. Repeat the above step for [major version config](./.ncurc.major.cjs)

### Take note

Make sure to comment why you didn't update a specific dependency so we can try again at a later time. Preferably add a link to a github issue (or similar).
