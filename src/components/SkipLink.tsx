/**
 * Skip Link - 跳过导航直达主内容
 * 键盘用户按 Tab 第一个看到的就是这个链接
 */
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      跳到主要内容
    </a>
  )
}
