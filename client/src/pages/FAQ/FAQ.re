let component = ReasonReact.statelessComponent("FAQ");

module Styles = {
  open Css;
  let qa =
    style([
      marginTop(em(1.)),
      padding(em(1.)),
      backgroundColor(hex("333")),
    ]);
};

let qas = [
  (
    "Where to contact for bug reports, feature requests, etc. I appreciate all tips and advice regarding any aspect of this site as well.",
    "lolonetricks@gmail.com",
  ),
  (
    "Why isn't this 100% accurate? So and so isn't on here! So and so is on here, but was kicked out! This person isn't masters, this person isn't challenger, etcetc.",
    "It'd be tough to make it perfectly accurate. I simply wanted to give everyone an accurate enough representation of the current one tricks in challengers and masters. Someone should be able to go on the site and get a good enough idea of what champions are being one tricked into the highest level of play.\nI'm still a student in college, and I'm still new to making complete projects. I simply went with the easiest route (when analyzing the data) and deployed ASAP.\nOver the next few weeks, I'll improve it so that we get more up-to-date data though!",
  ),
  (
    "This person isn't a 1 trick!",
    "Over the next few weeks, I'll be making drastic changes to the backend as I have more time. I'm working with a few other people to create a more robust algorithm. Although there are slight twists to the phrase one trick pony today, I define it as someone who really excels on one champ, but does below average on other champs. These types of one tricks are much more prominent in higher elo, and I found that a majority of them are easily identifiable and thus are on this list.",
  ),
  (
    "Will there be more features?",
    "Yes. I'm currently in the processing of refactoring the codebase. Features include runes, champion match-ups, finding the best champions instead of seeing the entire pane, etc. If you're a dev, find my repository and watch it for changes! I will be heavily working on this. :)",
  ),
  (
    "The na.op.gg link doesn't work.",
    "They changed their name. Try the lolking link instead (lolking will redirect you to their new name). The database will correct the names some time overnight.",
  ),
  (
    "What you'd make this with?",
    "At a high level: HTML, CSS, JS, React, Express, and MongoDB. Also integrating ReasonML with it now for easy types.",
  ),
  (
    "Any special mentions?",
    "I'd like to thank Richelle for all the support she has provided me, and Richelle if you're reading this, I hope you stop being a hardstuck D5* player. I'd like to thank all the people who checked out my site in its early stages and provided feedback and encouragement.",
  ),
];

let make = _children => {
  ...component,
  render: _self =>
    <div className="faq">
      <h3 className="faq-header"> (ReasonReact.stringToElement("faq")) </h3>
      <div className=Styles.qa>
        (
          ReasonReact.arrayToElement(
            Array.of_list(
              List.map(
                ((question, answer)) => <QA key=question question answer />,
                qas,
              ),
            ),
          )
        )
      </div>
    </div>,
};