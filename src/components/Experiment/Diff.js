import React, { PureComponent } from 'react';
import { Diff2Html } from 'diff2html';
import 'diff2html/dist/diff2html.css';
import './Diff.less';

class Diff extends PureComponent {
  constructor(props) {
    super(props);

    this.leftDiff = null;
    this.rightDiff = null;

    this.leftListen = true;
    this.rightListen = true;

    this.leftScrollListener = this.listerner('left').bind(this);
    this.rightScrollListener = this.listerner('right').bind(this);
  }

  render() {
    const { diffString, leftLoc, rightLoc, className } = this.props;
    const showLoc = leftLoc && rightLoc;
    const diffHTML = Diff2Html.getPrettyHtml(diffString, {
      inputFormat: 'diff',
      outputFormat: 'side-by-side',
      showFiles: false,
      matching: 'none',
      matchWordsThreshold: 0.25,
      matchingMaxComparisons: 2500,
    });
    return (
      <div className={`diff ${className}`}>
        {showLoc && (
          <div className="diff__locs">
            <div className="diff__loc left">{leftLoc} lines of code</div>
            <div className="diff__loc right">{rightLoc} lines of code</div>
          </div>
        )}
        <div
          className={`diff__content ${showLoc ? '_with-loc' : ''}`}
          dangerouslySetInnerHTML={{ __html: diffHTML }}
        />
      </div>
    );
  }

  componentDidMount() {
    this.listenScrolls();
  }

  componentWillUpdate() {
    this.unListenScrolls();
  }

  componentDidUpdate() {
    this.listenScrolls();
  }

  componentWillUnmount() {
    this.unListenScrolls();
  }

  listenScrolls() {
    const diffs = document.querySelectorAll('.d2h-file-side-diff');
    if (diffs.length) {
      [this.leftDiff, this.rightDiff] = diffs;
      this.leftDiff.addEventListener('scroll', this.leftScrollListener);
      this.rightDiff.addEventListener('scroll', this.rightScrollListener);
    }
  }

  unListenScrolls() {
    if (this.leftDiff) {
      this.leftDiff.removeEventListener('scroll', this.leftScrollListener);
    }
    if (this.rightDiff) {
      this.rightDiff.removeEventListener('scroll', this.rightScrollListener);
    }
  }

  listerner(side) {
    const oppositeSide = side === 'left' ? 'right' : 'left';

    return e => {
      if (!this[`${side}Listen`]) {
        return;
      }
      this[`${oppositeSide}Listen`] = false;
      this[`${oppositeSide}Diff`].scrollTop = e.target.scrollTop;
      window.setTimeout(() => {
        this[`${oppositeSide}Listen`] = true;
      }, 1);
    };
  }
}

export default Diff;
